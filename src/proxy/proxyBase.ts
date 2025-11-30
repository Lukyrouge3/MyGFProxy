// deno-lint-ignore no-import-prefix no-unversioned-import
import forge from "npm:node-forge";
import { RC4 } from "../utils/rc4.ts";
import { Logger } from "../utils/logger.ts";
import { MemoryReader } from "../io/reader.ts";
import { protocol_messages } from "../protocol/protocol.ts";
import { Message } from "../protocol/message.ts";

const logger = new Logger("ProxyBase");
export abstract class ProxyBase {

	protected proxy_keys: forge.pki.rsa.KeyPair;
	public rc4_decrypt: RC4 | undefined;
	public rc4_encrypt: RC4 | undefined;
	protected logger = new Logger("ProxyBase");
	public message_count: number = 0;

	constructor() {
		this.proxy_keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
	}

	public handle_raw_packet(data: MemoryReader): Uint8Array | null {
		// this.logger.debug("Received packet data:", data.getBuffer());

		if (!this.rc4_decrypt || !this.rc4_encrypt) {
			this.logger.error("RC4 ciphers not initialized.");
			return null;
		}

		// Decrypt
		const decrypted_data = this.rc4_decrypt.update(data.read(data.length()));
		// this.logger.debug("Received decrypted packet data:", decrypted_data);

		const decrypted_stream = new MemoryReader(decrypted_data.subarray(0, decrypted_data.length));
		// Deno.writeFileSync(`bins/server_command_${command_id}_packet.bin`, data_copy.getBuffer());

		let handled_data = decrypted_stream.getBuffer();
		const command_id = decrypted_stream.readUint16();
		if (protocol_messages[command_id]) {
			try {
				const MessageCtor = protocol_messages[command_id]!;
				const message = new MessageCtor();

				message.deserialize(decrypted_stream);

				logger.info(`Handling message: ${message.toString()}`);
				const handled_message = this.handle_message(message);
				if (handled_message) {
					handled_data = handled_message;
				}
			} catch (e) {
				Deno.writeFileSync(`bins/error_command_${command_id}_packet.bin`, data.getBuffer());
				logger.error(`Error handling message with Command ID: ${command_id}:`);
				console.error(e);
			}
		} else {
			logger.info(`Unknown packet with Command ID: ${command_id}`);
		}
		// Encrypt
		const encrypted_data = this.rc4_encrypt.update(handled_data);

		const packet = new Uint8Array(encrypted_data.length + 2);
		const packet_view = new DataView(packet.buffer);
		packet_view.setUint16(0, encrypted_data.length, true);
		packet.set(encrypted_data, 2);

		this.message_count++;
		return packet;


	}

	protected abstract handle_message(message: Message): Uint8Array | null;
}