import { Origin } from "../../generated/enums.ts";
import { world_protocol_messages } from "../../protocol/protocol.ts";
import { Logger } from "../../utils/logger.ts";
import { Proxy } from "../proxy.ts";
import { WorldProxyClient } from "./worldProxyClient.ts";
import { WorldProxyServer } from "./worldProxyServer.ts";

export const WORLD_TARGET_PORT = 5567;
export const WORLD_LISTEN_PORT = 5567;
export const WORLD_TARGET_HOST = "34.123.6.172";

export class WorldProxy extends Proxy {

	protected override server: WorldProxyServer;

	constructor(session_id: number) {
		super(WORLD_LISTEN_PORT, WORLD_TARGET_HOST, WORLD_TARGET_PORT, session_id);

		this.logger = new Logger("WorldProxy");

		this.server = new WorldProxyServer(new Logger("WorldProxyServer"), world_protocol_messages, "bins/world", session_id, Origin.WORLD_SERVER);
		this.client = new WorldProxyClient(new Logger("WorldProxyClient"), world_protocol_messages, "bins/world", session_id, Origin.WORLD_CLIENT);
	}
}