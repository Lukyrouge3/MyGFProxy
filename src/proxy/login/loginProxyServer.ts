import { TicketToWorldServerMessage } from "../../protocol/login/ticketToWorldServerMessage.ts";
import { Message } from "../../protocol/message.ts";
import { ProxyServer } from "../proxyServer.ts";

export class LoginProxyServer extends ProxyServer {

	protected override handle_message(message: Message): Uint8Array | null {
		if (message instanceof TicketToWorldServerMessage) {
			const new_message = new TicketToWorldServerMessage(
				message.unknown_1,
				message.self_ip,
				"192.168.1.183",
				message.server_port,
				message.ticket
			);

			this.logger.debug(`Modified TicketToWorldServerMessage to redirect to local world proxy at ${new_message.server_ip}.`);
			return new_message.serialize();
		}

		return null;
	}
}