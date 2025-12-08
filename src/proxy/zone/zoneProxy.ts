import { Origin } from "../../generated/enums.ts";
import { MessageConstructor, zone_protocol_messages } from "../../protocol/protocol.ts";
import { Logger } from "../../utils/logger.ts";
import { Proxy } from "../proxy.ts";
import { ZoneProxyClient } from "./zoneProxyClient.ts";
import { ZoneProxyServer } from "./zoneProxyServer.ts";

export const ZONE_LISTEN_PORT = 6112;
export const ZONE_TARGET_HOST = "34.123.6.172";
export const ZONE_TARGET_PORT = 6112;

export class ZoneProxy extends Proxy {

	public override server: ZoneProxyServer;
	protected override message_mapping: Record<number, MessageConstructor> = zone_protocol_messages;

	constructor(session_id: number) {
		super(ZONE_LISTEN_PORT, ZONE_TARGET_HOST, ZONE_TARGET_PORT, session_id);
		this.logger = new Logger("ZoneProxy");

		this.server = new ZoneProxyServer(new Logger("ZoneProxyServer"), this.message_mapping, "bins/zone", session_id, Origin.ZONE_SERVER);
		this.client = new ZoneProxyClient(new Logger("ZoneProxyClient"), this.message_mapping, "bins/zone", session_id, Origin.ZONE_CLIENT);
	}
}