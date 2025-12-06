import { login_protocol_messages, MessageConstructor } from "../../protocol/protocol.ts";
import { Logger } from "../../utils/logger.ts";
import { Proxy } from "../proxy.ts";
import { LoginProxyClient } from "./loginProxyClient.ts";
import { LoginProxyServer } from "./loginProxyServer.ts";

const LISTEN_PORT = 6969;
const TARGET_HOST = "login.en.dj.x-legend.com.tw";
const TARGET_PORT = 6545;

export class LoginProxy extends Proxy {

	protected override server: LoginProxyServer;
	protected override message_mapping: Record<number, MessageConstructor> = login_protocol_messages;

	constructor() {
		super(LISTEN_PORT, TARGET_HOST, TARGET_PORT);
		this.logger = new Logger("LoginProxy");

		this.server = new LoginProxyServer(new Logger("LoginProxyServer"), this.message_mapping, "bins/login");
		this.client = new LoginProxyClient(new Logger("LoginProxyClient"), this.message_mapping, "bins/login");
	}
}