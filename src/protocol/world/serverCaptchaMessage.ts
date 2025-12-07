import { MemoryReader } from "../../io/reader.ts";
import { Message } from "../message.ts";

export class ServerCaptchaMessage extends Message {
	public static override id = 65;

	public unknown_1!: number;
	public part!: number;
	public unknown_3!: number;
	public width!: number;
	public height!: number;
	public image_data!: Uint8Array;

	override deserialize(data: MemoryReader): void {
		this.unknown_1 = data.readUint32();
		this.part = data.readUint32();
		this.unknown_3 = data.readUint32();
		this.width = data.readUint32();
		this.height = data.readUint32();
		this.image_data = data.readStringAsArray();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `ServerCaptchaMessage(unknown_1=${this.unknown_1}, part=${this.part}, unknown_3=${this.unknown_3}, width=${this.width}, height=${this.height}, image_data_length=${this.image_data.length})`;
	}

}