// deno-lint-ignore no-import-prefix no-unversioned-import
import forge from "npm:node-forge";
import { RC4 } from "../utils/rc4.ts";
import { Logger } from "../utils/logger.ts";
import { MemoryReader } from "../io/reader.ts";
import { MessageConstructor } from "../protocol/protocol.ts";
import { Message } from "../protocol/message.ts";

export abstract class ProxyBase {

	protected proxy_keys: forge.pki.rsa.KeyPair;
	public rc4_decrypt: RC4 | undefined;
	public rc4_encrypt: RC4 | undefined;
	protected logger: Logger;
	public message_count: number = 0;
	protected message_mapping: Record<number, MessageConstructor> = {};
	protected bins_folder: string = "bins";

	constructor(logger: Logger, message_mapping: Record<number, MessageConstructor>, bins_folder: string = "bins") {
		this.proxy_keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
		this.logger = logger;
		this.message_mapping = message_mapping;
		this.bins_folder = bins_folder;
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

		let handled_data = decrypted_stream.getBuffer();
		const command_id = decrypted_stream.readUint16();
		Deno.writeFileSync(`${this.bins_folder}/command_${command_id}_packet.bin`, decrypted_data);
		if (this.message_mapping[command_id]) {
			try {
				const MessageCtor = this.message_mapping[command_id]!;
				const message = new MessageCtor();

				message.deserialize(decrypted_stream);

				this.logger.info(`Handling message: ${message.toString()}`);
				const handled_message = this.handle_message(message);
				if (handled_message) {
					handled_data = handled_message;
				}
			} catch (e) {
				this.logger.error(`Error handling message with Command ID: ${command_id}:`);
				console.error(e);
			}
		} else {
			this.logger.info(`Unknown packet with Command ID: ${command_id}`);
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