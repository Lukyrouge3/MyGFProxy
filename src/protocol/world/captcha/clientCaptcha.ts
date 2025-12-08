import { MemoryReader } from "../../../io/reader.ts";
import { Message } from "../../message.ts";

export class WorldClientCaptcha extends Message {
	public static override id = 65;

	public dx!: number;
	public dy!: number;
	public unknown_1!: number;
	public width!: number;
	public height!: number;
	public image_data!: Uint8Array;

	override deserialize(data: MemoryReader): void {
		this.dx = data.readUint32();
		this.dy = data.readUint32();
		this.unknown_1 = data.readUint32();
		this.width = data.readUint32();
		this.height = data.readUint32();
		this.image_data = data.readStringAsArray();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `WorldClientCaptcha(dx=${this.dx}, dy=${this.dy}, unknown_3=${this.unknown_1}, width=${this.width}, height=${this.height}, image_data_length=${this.image_data.length})`;
	}

}