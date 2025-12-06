import { MemoryReader } from "../io/reader.ts";
import { MessageConstructor } from "../protocol/protocol.ts";
import { Logger } from "../utils/logger.ts";
import { ProxyClient } from "./proxyClient.ts";
import { ProxyServer } from "./proxyServer.ts";

export class Proxy {

	public listen_port: number;
	public server_host: string;
	public server_port: number;
	protected server: ProxyServer;
	protected client: ProxyClient;
	protected logger: Logger;
	protected message_mapping: Record<number, MessageConstructor> = {};

	constructor(listen_port: number, host: string, port: number) {
		this.listen_port = listen_port;
		this.server_host = host;
		this.server_port = port;

		this.logger = new Logger("Proxy");

		this.server = new ProxyServer(this.logger, this.message_mapping, "bins");
		this.client = new ProxyClient(this.logger, this.message_mapping, "bins");
		// Start the async listener loop (constructor cannot be async)
		this.startListener();
	}

	private async startListener() {
		const listener = Deno.listen({ hostname: "0.0.0.0", port: this.listen_port });
		for await (const conn of listener) {
			// handle_client is async; do not await to allow concurrent handling
			this.handle_client(conn);
		}
	}

	private async handle_client(connection: Deno.TcpConn) {
		const server_conn = await Deno.connect({ hostname: this.server_host, port: this.server_port });

		this.pump(connection, server_conn, false);
		this.pump(server_conn, connection, true);
	}

	private async pump(src: Deno.Conn, dst: Deno.Conn, is_from_server = false) {
		const buf = new Uint8Array(65535);

		while (true) {
			try {
				const n = await src.read(buf);
				if (n === null) {
					dst.close();
					console.log(`Connection closed: ${is_from_server ? "server -> client" : "client -> server"}`);
					break;
				}

				const stream = new MemoryReader(buf.subarray(0, n));

				if (is_from_server && this.server.message_count === 0) {
					await dst.write(this.server.handle_initial_packet(stream));
					this.server.message_count++;
					continue;
				}
				if (!is_from_server && this.client.message_count === 0) {
					await dst.write(this.client.handle_initial_packet(stream.read(stream.length()), this.server));
					this.client.message_count++;
					continue;
				}

				let packet = new Uint8Array(0);
				let packet_size = 0;
				while (stream.length() > 0) {
					if (packet.length == 0) {
						// It's a new packet
						packet_size = stream.readUint16();
					}

					const chunk = stream.read(packet_size - packet.length);
					const new_packet = new Uint8Array(packet.length + chunk.length);
					new_packet.set(packet, 0);
					new_packet.set(chunk, packet.length);
					packet = new_packet;
					if (packet.length == packet_size) {
						let response;
						if (is_from_server) {
							response = this.server.handle_raw_packet(new MemoryReader(packet));
						} else {
							response = this.client.handle_raw_packet(new MemoryReader(packet));
						}

						if (response !== null) {
							await dst.write(response);
						}

						packet = new Uint8Array(0);
						packet_size = 0;
					}
				}
			} catch (e) {
				console.error("Error during read/write:", e);
				dst.close();
				break;
			}
		}
	}
}