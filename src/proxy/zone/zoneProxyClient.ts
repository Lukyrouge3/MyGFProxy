import { ZoneServerReceiveTicket } from "../../protocol/zone/index.ts";
import { ProxyClient } from "../proxyClient.ts";
import { Proxy } from "../proxy.ts";
import { Message } from "../../protocol/message.ts";
import { ZONE_TARGET_HOST } from "./zoneProxy.ts";

export class ZoneProxyClient extends ProxyClient {

	protected override handle_message(message: Message, proxy: Proxy): Uint8Array | null {
		if (message instanceof ZoneServerReceiveTicket) {
			message.server_ip = ZONE_TARGET_HOST;
			// message.server_port = WORLD_TARGET_PORT

			this.logger.debug(`Modified ZoneServerReceiveTicket to redirect to official world server at ${message.server_ip}.`);
			return message.serialize();
		}

		return null;
	}
}