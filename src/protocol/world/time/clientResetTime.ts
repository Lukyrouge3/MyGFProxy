import { MemoryReader } from "../../../io/reader.ts";
import { Message } from "../../message.ts";

export class WorldClientResetTime extends Message {
	public static override id = 43;

	public server_time!: number;
	public start_time!: number;
	public gmtOffTime!: number;

	override deserialize(data: MemoryReader): void {
		this.server_time = data.readUint32();
		this.start_time = data.readUint32();
		this.gmtOffTime = data.readUint32();
	}

	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override toString(): string {
		return `ClientResetTime(server_time=${this.server_time}, start_time=${this.start_time}, gmtOffTime=${this.gmtOffTime})`;
	}
}