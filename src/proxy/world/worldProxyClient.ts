import { Message } from "../../protocol/message.ts";
import { WorldServerReceiveTicket } from "../../protocol/world/handshake/serverReceiveTicket.ts";
import { ProxyClient } from "../proxyClient.ts";
import { WORLD_TARGET_HOST } from "./worldProxy.ts";
import { Proxy } from "../proxy.ts";

export class WorldProxyClient extends ProxyClient {

	protected override handle_message(message: Message, proxy: Proxy): Uint8Array | null {
		if (message instanceof WorldServerReceiveTicket) {
			message.server_ip = WORLD_TARGET_HOST;
			// message.server_port = WORLD_TARGET_PORT

			this.logger.debug(`Modified WorldHelloClientMessage to redirect to official world server at ${message.server_ip}.`);
			return message.serialize();
		}

		return null;
	}
}