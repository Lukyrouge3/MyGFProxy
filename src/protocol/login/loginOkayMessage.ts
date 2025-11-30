import { MemoryReader } from "../../io/reader.ts";
import { Message } from "../message.ts";

export class LoginOkayMessage extends Message {
	public static override id = 8;

	public account_id!: string;

	override deserialize(data: MemoryReader): void {
		this.account_id = data.readString();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `LoginOkayMessage(account_id="${this.account_id}")`;
	}

}