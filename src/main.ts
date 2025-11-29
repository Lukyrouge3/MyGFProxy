import { Server } from "./server.ts";
import { Client } from "./client.ts";
import { MemoryReader } from "./io/reader.ts";

// proxy.ts
const LISTEN_PORT = 6969;
const TARGET_HOST = "login.en.dj.x-legend.com.tw";
const TARGET_PORT = 6545;

const serv = new Server();
const clie = new Client();

const listener = Deno.listen({ hostname: "0.0.0.0", port: LISTEN_PORT });
console.log(`Proxy listening on ${LISTEN_PORT}`);

for await (const client of listener) {
	handle(client);
}


async function handle(client: Deno.Conn) {
	const server = await Deno.connect({ hostname: TARGET_HOST, port: TARGET_PORT });

	pump(client, server, false);
	pump(server, client, true);
}

async function pump(src: Deno.Conn, dst: Deno.Conn, is_from_server = false) {
	const buf = new Uint8Array(65535);

	while (true) {
		const n = await src.read(buf);
		if (n === null) {
			dst.close();
			console.log(`Connection closed: ${is_from_server ? "server -> client" : "client -> server"}`);
			break;
		}

		const stream = new MemoryReader(buf.subarray(0, n));

		if (is_from_server && serv.message_count === 0) {
			await dst.write(serv.handle_initial_packet(stream));
			serv.message_count++;
			continue;
		}
		if (!is_from_server && clie.message_count === 0) {
			await dst.write(clie.handle_initial_packet(stream.read(stream.length())));
			clie.message_count++;
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
					response = serv.handle_raw_packet(new MemoryReader(packet));
				} else {
					response = clie.handle_raw_packet(new MemoryReader(packet));
				}

				if (response !== null) {
					await dst.write(response);
				}

				packet = new Uint8Array(0);
				packet_size = 0;
			}
		}
	}
}

export { serv, clie };