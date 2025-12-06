import { Message } from "../../protocol/message.ts";
import { MessageConstructor } from "../../protocol/protocol.ts";
import { WorldHelloClientMessage } from "../../protocol/world/worldhelloClientMessage.ts";
import { Logger } from "../../utils/logger.ts";
import { ProxyClient } from "../proxyClient.ts";

export class WorldProxyClient extends ProxyClient {

	protected override handle_message(message: Message): Uint8Array | null {
		if (message instanceof WorldHelloClientMessage) {
			message.server_ip = "34.123.6.172";

			this.logger.debug(`Modified WorldHelloClientMessage to redirect to official world server at ${message.server_ip}.`);
			return message.serialize();
		}

		return null;
	}
}