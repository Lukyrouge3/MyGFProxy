import { MemoryReader } from "../../../io/reader.ts";
import { MemoryWriter } from "../../../io/writer.ts";
import { Message } from "../../message.ts";

export class ZoneServerMoveSelfMessage extends Message {

	public static override id = 26;

	public dx!: number; // ushort
	public dy!: number; // ushort
	public tx!: number; // ushort
	public ty!: number; // ushort
	public unknown_chars!: Uint8Array; // char[]
	public faceDir!: number; // ushort
	public moveAction!: number; // ushort

	override deserialize(data: MemoryReader): void {
		this.dx = data.readUint16();
		this.dy = data.readUint16();
		this.tx = data.readUint16();
		this.ty = data.readUint16();

		const arr_len = data.readUint32();
		this.unknown_chars = data.read(arr_len);

		this.faceDir = data.readUint16();
		this.moveAction = data.readUint16();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `ZoneServerMoveSelfMessage(dx=${this.dx}, dy=${this.dy}, tx=${this.tx}, ty=${this.ty}, unknown_chars=[${this.unknown_chars.length} bytes], faceDir=${this.faceDir}, moveAction=${this.moveAction})`;
	}

}