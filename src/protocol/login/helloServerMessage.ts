import { MemoryReader } from "../../io/reader.ts";
import { Message } from "../message.ts";

export class HelloServerMessage extends Message {
	public static override id = 4;

	public unknown!: Uint8Array;

	override deserialize(data: MemoryReader): void {
		this.unknown = data.read(4);
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `HelloServerMessage()`;
	}
}