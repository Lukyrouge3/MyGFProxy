import { MemoryReader } from "../../../io/reader.ts";
import { MemoryWriter } from "../../../io/writer.ts";
import { Message } from "../../message.ts";

export class WorldServerCaptchaReturn extends Message {

	public static override id = 4;

	public answer!: string;

	override deserialize(data: MemoryReader): void {
		this.answer = data.readString();
	}
	override serialize(): Uint8Array {
		const writer = new MemoryWriter();
		writer.writeUint16(WorldServerCaptchaReturn.id);
		writer.writeString(this.answer);
		return writer.getBuffer();
	}
	override toString(): string {
		return `WorldServerCaptchaReturn(answer=${this.answer})`;
	}
}
