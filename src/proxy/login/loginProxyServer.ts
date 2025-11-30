import { TicketToWorldServerMessage } from "../../protocol/login/ticketToWorldServerMessage.ts";
import { Message } from "../../protocol/message.ts";
import { ProxyServer } from "../proxyServer.ts";

export class LoginProxyServer extends ProxyServer {

	protected override handle_message(message: Message): Uint8Array | null {
		if (message instanceof TicketToWorldServerMessage) {
			const new_message = new TicketToWorldServerMessage(
				message.self_ip,
				"127.0.0.1",
				6770,
				message.ticket
			);

			console.log("Modified TicketToWorldServerMessage to redirect to local world server.");
			console.log(new_message.serialize());
			return new_message.serialize();
		}

		return null;
	}
}