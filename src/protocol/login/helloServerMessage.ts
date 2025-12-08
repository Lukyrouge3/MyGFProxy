import { MemoryReader } from "../../io/reader.ts";
import { MemoryWriter } from "../../io/writer.ts";
import { Message } from "../message.ts";

export class HelloServerMessage extends Message {
	public static override id = 4;

	public unknown!: Uint8Array;

	override deserialize(data: MemoryReader): void {
		this.unknown = data.read(4);
	}
	override serialize(): Uint8Array {
		const writer = new MemoryWriter();
		writer.writeUint16(HelloServerMessage.id);
		writer.write(this.unknown);
		return writer.getBuffer();
	}
	override toString(): string {
		return `HelloServerMessage()`;
	}
}