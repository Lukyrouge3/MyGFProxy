// deno-lint-ignore-file no-unversioned-import no-import-prefix
import { Buffer } from "node:buffer";
import forge from "npm:node-forge";
import { Base } from "./base.ts";
import { forgeToU8, u8ToForgeBytes } from "./utils.ts";
import { Logger } from "./logger.ts";
import { MemoryStream } from "./memoryStream.ts";

const logger = new Logger("Server");

export class Server extends Base {
	private public_key: forge.pki.rsa.PublicKey | undefined;

	constructor() {
		super();
	}

	protected packet_handle(data: MemoryStream): Uint8Array {
		const data_copy = data.getBuffer();

		const command_id = data.readUint16(0, true);
		logger.info(`Handling packet with Command ID: ${command_id}`);

		return data_copy;
	}

	public handle_initial_packet(stream: MemoryStream): Uint8Array {

		const data = stream.read(stream.length());
		const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

		logger.info("Handling initial packet from server.");
		const rsa_public_key_modulus_size = view.getUint32(0, true);
		const rsa_public_key_modulus = data.subarray(8, 8 + rsa_public_key_modulus_size);
		// console.log("RSA Public Key Modulus:", rsa_public_key_modulus);
		Deno.writeFileSync("server_rsa_modulus.bin", rsa_public_key_modulus);

		const exponent_size = view.getUint32(4, true);
		const exponent = data.subarray(8 + rsa_public_key_modulus_size, 8 + rsa_public_key_modulus_size + exponent_size);
		// console.log("RSA Public Key Exponent:", exponent);
		// Deno.writeFileSync("server_rsa_exponent.bin", exponent);

		Deno.writeFileSync("server_rsa_exponent.bin", exponent);

		const nBig = new forge.jsbn.BigInteger(Buffer.from(rsa_public_key_modulus).toString("hex"), 16);
		const eBig = new forge.jsbn.BigInteger(Buffer.from(exponent).toString("hex"), 16);
		this.public_key = forge.pki.setRsaPublicKey(nBig, eBig);
		console.log("Constructed server RSA public key.");

		const custom_packet = new Uint8Array(8 + this.proxy_keys.publicKey.n.toByteArray().length + this.proxy_keys.publicKey.e.toByteArray().length);
		const proxy_modulus_bytes = new Uint8Array(Buffer.from(this.proxy_keys.publicKey.n.toByteArray()));
		const proxy_exponent_bytes = new Uint8Array(Buffer.from(this.proxy_keys.publicKey.e.toByteArray()));
		const custom_view = new DataView(custom_packet.buffer);

		custom_view.setUint32(0, proxy_modulus_bytes.length, true);
		custom_view.setUint32(4, proxy_exponent_bytes.length, true);
		custom_packet.set(proxy_modulus_bytes, 8);
		custom_packet.set(proxy_exponent_bytes, 8 + proxy_modulus_bytes.length);

		logger.info("Sending proxy RSA public key to client.");
		return custom_packet;
	}

	public decrypt_with_proxy_key(encrypted_data: Uint8Array): Uint8Array {
		// convert incoming bytes to a binary string for forge.decrypt
		const decryptedStr = this.proxy_keys.privateKey.decrypt(u8ToForgeBytes(encrypted_data), "RSAES-PKCS1-V1_5");
		// convert the decrypted binary string back to bytes
		return forgeToU8(decryptedStr);
	}

	public encrypt_with_server_key(data: Uint8Array): Uint8Array {
		if (!this.public_key) {
			throw new Error("Server public key not initialized.");
		}

		// convert incoming bytes to a binary string for forge.encrypt
		const encryptedStr = this.public_key.encrypt(u8ToForgeBytes(data), "RSAES-PKCS1-V1_5");
		// convert the encrypted binary string back to bytes
		return forgeToU8(encryptedStr);
	}
}