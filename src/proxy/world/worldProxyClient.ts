import { Message } from "../../protocol/message.ts";
import { WorldHelloClientMessage } from "../../protocol/world/worldhelloClientMessage.ts";
import { ProxyClient } from "../proxyClient.ts";
import { WORLD_TARGET_HOST, WORLD_TARGET_PORT } from "./worldProxy.ts";
import { Proxy } from "../proxy.ts";
import { CaptchaAnwserClientMessage } from "../../protocol/world/captchaAnwserClientMessage.ts";

export class WorldProxyClient extends ProxyClient {

	protected override handle_message(message: Message, proxy: Proxy): Uint8Array | null {
		if (message instanceof WorldHelloClientMessage) {
			message.server_ip = WORLD_TARGET_HOST;
			// message.server_port = WORLD_TARGET_PORT

			this.logger.debug(`Modified WorldHelloClientMessage to redirect to official world server at ${message.server_ip}.`);
			return message.serialize();
		}
		if (message instanceof CaptchaAnwserClientMessage) {
			this.logger.debug(message.serialize());
		}

		return null;
	}
}