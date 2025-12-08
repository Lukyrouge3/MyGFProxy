import { MemoryReader } from "../../../io/reader.ts";
import { Message } from "../../message.ts";

export class WorldClientHello extends Message {
	public static override id = 38;

	public version!: number;

	override deserialize(data: MemoryReader): void {
		this.version = data.readUint32();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `WorldClientHello(version=${this.version})`;
	}
}