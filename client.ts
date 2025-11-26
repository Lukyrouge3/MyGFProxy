import { Buffer } from "node:buffer";
import forge from "npm:node-forge";
import { Base } from "./base.ts";
import { serv } from "./main.ts";
import { forgeToU8, u8ToForgeBytes } from "./utils.ts";
import { RC4 } from "./rc4.ts";
import { Logger } from "./logger.ts";

const logger = new Logger("Client");

export class Client extends Base {
	private client_public_key: forge.pki.rsa.PublicKey;
	private message_count: number = 0;
	private rc4_decrypt: RC4;
	private rc4_encrypt: RC4;

	constructor() {
		super();
	}

	async packet_handle(data: Uint8Array): Promise<Uint8Array> {
		logger.debug("Received packet data:", data);
		const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

		if (this.message_count === 0) {
			this.message_count++;
			return this.handle_initial_packet(data);
		}

		// Decrypt
		const decrypted_data = this.rc4_decrypt.update(data);
		const handled_data = this.handle_raw_packet(decrypted_data);

		// Encrypt
		const encrypted_data = this.rc4_encrypt.update(handled_data);

		this.message_count++;
		return encrypted_data;
	}

	private handle_initial_packet(data: Uint8Array): Uint8Array {
		logger.info("Handling initial packet from client.");
		const decrypted_rc4_key = serv.decrypt_with_proxy_key(data);
		logger.debug("Decrypted RC4 Key from client:", decrypted_rc4_key);
		this.rc4_decrypt = new RC4(decrypted_rc4_key);
		this.rc4_encrypt = new RC4(decrypted_rc4_key);

		serv.rc4_decrypt = new RC4(decrypted_rc4_key);
		serv.rc4_encrypt = new RC4(decrypted_rc4_key);

		const encrypted_rc4_key = serv.encrypt_with_server_key(decrypted_rc4_key);

		logger.debug("Encrypted RC4 Key to send to server:", encrypted_rc4_key);
		return encrypted_rc4_key;
	}

	private handle_raw_packet(data: Uint8Array): Uint8Array {
		const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

		const command_id = view.getUint16(0, true);
		logger.info(`Handling packet with Command ID: ${command_id}`);

		return data;
	}
}