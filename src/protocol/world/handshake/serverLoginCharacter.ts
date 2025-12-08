import { MemoryReader } from "../../../io/reader.ts";
import { Message } from "../../message.ts";

export class WorldServerLoginCharacter extends Message {
	public static override id = 9;

	public characterId!: number;
	public netAdress!: string;
	public osBit!: number;

	override deserialize(data: MemoryReader): void {
		this.characterId = data.readUint32();
		this.netAdress = data.readString();
		this.osBit = data.readUint8();
	}
	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `WorldServerLoginCharacter(characterId=${this.characterId}, netAdress=${this.netAdress}, osBit=${this.osBit})`;
	}
}