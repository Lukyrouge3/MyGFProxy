import { MemoryReader } from "../../../io/reader.ts";
import { MemoryWriter } from "../../../io/writer.ts";
import { Message } from "../../message.ts";

export class ZoneClientMoveChar extends Message {

	public static override id = 343;

	public character_id!: number;
	public dx!: number; // float
	public dy!: number; // float
	public faceDir!: number; // float

	override deserialize(data: MemoryReader): void {
		this.character_id = data.readUint32();
		this.dx = data.readFloat32();
		this.dy = data.readFloat32();
		this.faceDir = data.readFloat32();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `ZoneClientMoveChar(character_id=${this.character_id}, dx=${this.dx}, dy=${this.dy}, faceDir=${this.faceDir})`;
	}

}