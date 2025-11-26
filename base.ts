import { Buffer } from "node:buffer";
import forge from "npm:node-forge";
import { MemoryStream } from "./memoryStream.ts";
import { RC4 } from "./rc4.ts";
import { Logger } from "./logger.ts";


export abstract class Base {

	protected proxy_keys: forge.pki.rsa.KeyPair;
	public rc4_decrypt: RC4 | undefined;
	public rc4_encrypt: RC4 | undefined;
	protected logger = new Logger("Base");
	public message_count: number = 0;

	constructor() {
		this.proxy_keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
	}

	public handle_raw_packet(data: MemoryStream): Uint8Array | null {
		// this.logger.debug("Received packet data:", data.getBuffer());

		if (!this.rc4_decrypt || !this.rc4_encrypt) {
			this.logger.error("RC4 ciphers not initialized.");
			return null;
		}

		// Decrypt
		const decrypted_data = this.rc4_decrypt.update(data.read(data.length()));
		this.logger.debug("Received decrypted packet data:", decrypted_data);

		const decrypted_stream = new MemoryStream(decrypted_data.length);
		decrypted_stream.write(decrypted_data);
		const handled_data = this.packet_handle(decrypted_stream);

		// Encrypt
		const encrypted_data = this.rc4_encrypt.update(handled_data);

		const packet = new Uint8Array(encrypted_data.length + 2);
		const packet_view = new DataView(packet.buffer);
		packet_view.setUint16(0, encrypted_data.length, true);
		packet.set(encrypted_data, 2);

		this.message_count++;
		return packet;


	}

	protected abstract packet_handle(data: MemoryStream): Uint8Array;
}