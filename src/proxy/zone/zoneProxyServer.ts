import { Message } from "../../protocol/message.ts";
import { Proxy } from "../proxy.ts";
import { ProxyServer } from "../proxyServer.ts";

export class ZoneProxyServer extends ProxyServer {

	protected override handle_message(message: Message, proxy: Proxy): Uint8Array | null {


		return null;
	}
}