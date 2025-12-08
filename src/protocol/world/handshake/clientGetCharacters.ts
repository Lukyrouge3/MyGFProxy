import { MemoryReader } from "../../../io/reader.ts";
import { Serializable } from "../../../io/serializable.ts";
import { Message } from "../../message.ts";

export class WorldClientGetCharacters extends Message {
	public static override id = 41;

	public character_count!: number;
	public characters!: Character[];

	override deserialize(data: MemoryReader): void {
		this.character_count = data.readUint16();
		this.characters = []; // TODO: implement character reading
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `WorldClientGetCharacters(character_count=${this.character_count})`;
	}
}

export class Character extends Serializable {
	public id!: number;
	public name!: string;
	public family_id!: number;
	public level!: number; // short
	public node_id!: number; // short
	public race_id!: number; // short
	public class_id!: number; // short
	public privilege!: number; // short
	public online!: boolean;
	public family_rank!: number; // uchar

	override deserialize(data: MemoryReader): void {
		this.id = data.readUint32();
		this.name = data.readString();
		this.family_id = data.readUint32();
		this.level = data.readUint16();
		this.node_id = data.readUint16();
		this.race_id = data.readUint16();
		this.class_id = data.readUint16();
		this.privilege = data.readUint16();
		this.online = data.readUint8() !== 0;
		this.family_rank = data.readUint8();

		// Skip unused data to align with expected structure
		data.skip(0xd8 - 0x2a); // Assuming 10 bytes of unused data

		throw new Error("Method not implemented.");
	}

	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		throw new Error("Method not implemented.");
	}

}