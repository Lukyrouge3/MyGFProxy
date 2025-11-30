import { Proxy } from "../proxy.ts";
import { WorldProxyServer } from "./worldProxyServer.ts";

export class WorldProxy extends Proxy {

	protected override server: WorldProxyServer;

	constructor() {
		super(6970, "34.123.6.172", 5567);

		this.server = new WorldProxyServer();
	}
}