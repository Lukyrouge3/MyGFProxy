import { MemoryReader } from "../../../io/reader.ts";
import { MemoryWriter } from "../../../io/writer.ts";
import { Message } from "../../message.ts";

export class WorldServerReceiveTicket extends Message {

	public static override id = 6;

	public unknown_1!: Uint8Array; // 4bytes
	public self_ip!: string;
	public server_ip!: string;
	public server_port!: number;
	public ticket!: Uint8Array; // 8bytes
	public unknown_string_1!: string;
	public lang!: string;
	public unknown_string_2!: string;
	public cpu!: string;

	override deserialize(data: MemoryReader): void {
		this.unknown_1 = data.read(4);
		this.self_ip = data.read(4).reduce((acc, byte) => acc + byte.toString() + ".", "").slice(0, -1);
		this.server_ip = data.read(4).reduce((acc, byte) => acc + byte.toString() + ".", "").slice(0, -1);
		this.server_port = data.readUint16();
		this.ticket = data.read(8);
		this.unknown_string_1 = data.readString();
		this.lang = data.readString();
		this.unknown_string_2 = data.readString();
		this.cpu = data.readString();
	}
	override serialize(): Uint8Array {
		const writer = new MemoryWriter();
		writer.writeUint16(WorldServerReceiveTicket.id);
		writer.write(this.unknown_1);
		writer.write(new Uint8Array(this.self_ip.split(".").map(octet => parseInt(octet, 10))));
		writer.write(new Uint8Array(this.server_ip.split(".").map(octet => parseInt(octet, 10))));
		writer.writeUint16(this.server_port);
		writer.write(this.ticket);
		writer.writeString(this.unknown_string_1);
		writer.writeString(this.lang);
		writer.writeString(this.unknown_string_2);
		writer.writeString(this.cpu);
		return writer.getBuffer();
	}
	override toString(): string {
		return `WorldServerReceiveTicket(self_ip: ${this.self_ip}, server_ip: ${this.server_ip}, server_port: ${this.server_port}, ticket: [${Array.from(this.ticket).join(", ")}], lang: ${this.lang}, cpu: ${this.cpu})`;
	}

}