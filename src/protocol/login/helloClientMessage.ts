import { MemoryReader } from "../../io/reader.ts";
import { Message } from "../message.ts";

export class HelloClientMessage extends Message {
	public static override id = 3;

	public account_id!: string;
	public password!: string;
	public lang!: string;
	public unknown_string!: string;
	public unknown_number!: number;
	public client_version!: string;

	override deserialize(data: MemoryReader): void {
		this.account_id = data.readString();
		this.password = data.readString();
		this.lang = data.readString();
		this.unknown_string = data.readString();
		this.unknown_number = data.readUint32();
		this.client_version = data.readString();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `HelloClientMessage(account_id="${this.account_id}", password="******", lang="${this.lang}", client_version="${this.client_version}")`;
	}

}