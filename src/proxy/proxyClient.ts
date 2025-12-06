import { ProxyBase } from "./proxyBase.ts";
import { RC4 } from "../utils/rc4.ts";
import { Logger } from "../utils/logger.ts";
import { ProxyServer } from "./proxyServer.ts";
import { Message } from "../protocol/message.ts";
import { MessageConstructor } from "../protocol/protocol.ts";
import { Origin } from "../generated/enums.ts";

export class ProxyClient extends ProxyBase {

	constructor(logger: Logger, message_mapping: Record<number, MessageConstructor>, bins_folder: string, session_id: number, origin: Origin) {
		super(logger, message_mapping, bins_folder + "/client", session_id, origin);
	}

	protected override handle_message(message: Message): Uint8Array | null {
		return null;
	}

	public handle_initial_packet(data: Uint8Array, server: ProxyServer): Uint8Array {
		this.logger.info("Handling initial packet from client.");
		const decrypted_rc4_key = server.decrypt_with_proxy_key(data);
		// this.logger.debug("Decrypted RC4 Key from client:", decrypted_rc4_key);
		this.rc4_decrypt = new RC4(decrypted_rc4_key);
		this.rc4_encrypt = new RC4(decrypted_rc4_key);

		server.rc4_decrypt = new RC4(decrypted_rc4_key);
		server.rc4_encrypt = new RC4(decrypted_rc4_key);

		const encrypted_rc4_key = server.encrypt_with_server_key(decrypted_rc4_key);

		// logger.debug("Encrypted RC4 Key to send to server:", encrypted_rc4_key);
		return encrypted_rc4_key;
	}
}