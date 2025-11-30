import { MemoryReader } from "../../io/reader.ts";
import { Message } from "../message.ts";

export class SelectWorldServerMessage extends Message {
	public static override id = 2;

	public server_id!: number;
	public account_id!: string;
	public account_password!: string;

	override deserialize(data: MemoryReader): void {
		this.server_id = data.readUint16();
		this.account_id = data.readString();
		this.account_password = data.readString();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `SelectWorldServerMessage(server_id=${this.server_id}, account_id="${this.account_id}", account_password="******")`;
	}
}