import { Buffer } from "node:buffer";
import forge from "npm:node-forge";


export abstract class Base {

	protected proxy_keys: forge.pki.rsa.KeyPair;

	constructor() {
		this.proxy_keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
	}

	abstract packet_handle(data: Uint8Array): Promise<Uint8Array | null>;
}