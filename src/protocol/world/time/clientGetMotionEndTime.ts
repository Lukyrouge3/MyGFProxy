import { MemoryReader } from "../../../io/reader.ts";
import { Message } from "../../message.ts";

export class WorldClientGetMotionEndTime extends Message {
	public static override id = 80;

	override deserialize(data: MemoryReader): void {
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `ClientGetMotionEndTime()`;
	}
}