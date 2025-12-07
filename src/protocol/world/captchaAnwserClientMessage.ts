import { MemoryReader } from "../../io/reader.ts";
import { MemoryWriter } from "../../io/writer.ts";
import { Message } from "../message.ts";

export class CaptchaAnwserClientMessage extends Message {

	public static override id = 4;

	public answer!: string;

	override deserialize(data: MemoryReader): void {
		this.answer = data.readString();
	}
	override serialize(): Uint8Array {
		const writer = new MemoryWriter();
		writer.writeUint16(CaptchaAnwserClientMessage.id);
		writer.writeString(this.answer);
		return writer.getBuffer();
	}
	override toString(): string {
		return `CaptchaAnwserClientMessage(answer=${this.answer})`;
	}
}
