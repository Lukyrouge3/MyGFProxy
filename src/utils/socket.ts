// deno-lint-ignore no-unversioned-import no-import-prefix
import { WebSocketServer, WebSocket } from "npm:ws";
import { Message } from "../generated/client.ts";
import { Logger } from "./logger.ts";

export class Socket {
	private clients = new Set<WebSocket>();
	private server: WebSocketServer;
	private logger = new Logger("Socket");

	constructor(port: number) {
		this.server = new WebSocketServer({ port });
	}

	public start() {
		this.server.on("connection", (ws: WebSocket) => {
			this.clients.add(ws);
			this.logger.info(`New client connected. Total clients: ${this.clients.size}`);

			ws.on("close", () => {
				this.clients.delete(ws);
				this.logger.info(`Client disconnected. Total clients: ${this.clients.size}`);
			});
		});
	}

	public broadcast(message: Message) {
		const payload = JSON.stringify(message);

		for (const client of this.clients) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(payload);
			}
		}
	}
}

export const socket = new Socket(4000);
