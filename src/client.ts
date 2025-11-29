import { ProxyBase } from "./io/proxyBase.ts";
import { serv } from "./main.ts";
import { RC4 } from "./utils/rc4.ts";
import { Logger } from "./utils/logger.ts";
import { MemoryStream } from "./io/memoryStream.ts";

const logger = new Logger("Client");

export class Client extends ProxyBase {

	constructor() {
		super();
	}

	protected packet_handle(data: MemoryStream): Uint8Array {
		const data_copy = data.getBuffer();

		const command_id = data.readUint16(0, true);
		logger.info(`Handling packet with Command ID: ${command_id}`);
		Deno.writeFileSync(`bins/client_command_${command_id}_packet.bin`, data_copy);
		return data_copy;
	}

	public handle_initial_packet(data: Uint8Array): Uint8Array {
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
}