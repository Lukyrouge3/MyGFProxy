import { MemoryReader } from "../../../io/reader.ts";
import { MemoryWriter } from "../../../io/writer.ts";
import { Message } from "../../message.ts";

export class ZoneServerReceiveTicket extends Message {

	public static override id = 45;

	public character_id!: number; // 4bytes
	public self_ip!: string;
	public server_ip!: string;
	public server_port!: number;
	public ticket!: Uint8Array; // 8bytes

	override deserialize(data: MemoryReader): void {
		this.character_id = data.readUint32();
		this.self_ip = data.read(4).reduce((acc, byte) => acc + byte.toString() + ".", "").slice(0, -1);
		this.server_ip = data.read(4).reduce((acc, byte) => acc + byte.toString() + ".", "").slice(0, -1);
		this.server_port = data.readUint16();
		this.ticket = data.read(8);
	}
	override serialize(): Uint8Array {
		const writer = new MemoryWriter();
		writer.writeUint16(ZoneServerReceiveTicket.id);
		writer.writeUint32(this.character_id);
		writer.write(new Uint8Array(this.self_ip.split(".").map(octet => parseInt(octet, 10))));
		writer.write(new Uint8Array(this.server_ip.split(".").map(octet => parseInt(octet, 10))));
		writer.writeUint16(this.server_port);
		writer.write(this.ticket);
		return writer.getBuffer();
	}
	override toString(): string {
		return `ZoneServerReceiveTicket(character_id: ${this.character_id}, self_ip: ${this.self_ip}, server_ip: ${this.server_ip}, server_port: ${this.server_port}, ticket: [${Array.from(this.ticket).join(", ")}])`;
	}

}