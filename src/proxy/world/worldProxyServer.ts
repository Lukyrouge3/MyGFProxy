import { TicketToWorldServerMessage } from "../../protocol/login/ticketToWorldServerMessage.ts";
import { Message } from "../../protocol/message.ts";
import { ProxyServer } from "../proxyServer.ts";

export class WorldProxyServer extends ProxyServer {

	protected override handle_message(message: Message): Uint8Array | null {
		return null;
	}
}