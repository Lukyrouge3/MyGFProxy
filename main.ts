import forge from "npm:node-forge";
import { Buffer } from "node:buffer";
import { Server } from "./server.ts";
import { Client } from "./client.ts";

// proxy.ts
const LISTEN_PORT = 6969;
const TARGET_HOST = "login.en.dj.x-legend.com.tw";
const TARGET_PORT = 6545;

let server_rsa;
let server_message_count = 0;
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


		// Here you can inspect the bytes:
		// console.log(new Date(), is_from_server ? "Server -> Client" : "Client -> Server", buf.subarray(0, n));

		let response;
		if (is_from_server) {
			response = await serv.packet_handle(buf.subarray(0, n));
		} else {
			response = await clie.packet_handle(buf.subarray(0, n));
		}

		if (response !== null) {
			await dst.write(response);
			console.log("Sent response of length", response.length);
		}
	}
}

export { serv, clie };