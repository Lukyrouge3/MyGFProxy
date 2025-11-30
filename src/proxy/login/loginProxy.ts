import { Proxy } from "../proxy.ts";
import { LoginProxyServer } from "./loginProxyServer.ts";

const LISTEN_PORT = 6969;
const TARGET_HOST = "login.en.dj.x-legend.com.tw";
const TARGET_PORT = 6545;

export class LoginProxy extends Proxy {

	protected override server: LoginProxyServer;

	constructor() {
		super(LISTEN_PORT, TARGET_HOST, TARGET_PORT);

		this.server = new LoginProxyServer();
	}
}