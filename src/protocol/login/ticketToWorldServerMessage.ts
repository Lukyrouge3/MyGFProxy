import { MemoryReader } from "../../io/reader.ts";
import { MemoryWriter } from "../../io/writer.ts";
import { Message } from "../message.ts";

export class TicketToWorldServerMessage extends Message {
	public static override id = 7;

	public unknown_1: number;
	public self_ip: string;
	public server_ip: string;
	public server_port: number;
	public ticket: Uint8Array;

	constructor(unknown_1 = 0, self_ip: string = "", server_ip: string = "", server_port: number = 0, ticket: Uint8Array = new Uint8Array()) {
		super();
		this.unknown_1 = unknown_1;
		this.self_ip = self_ip;
		this.server_ip = server_ip;
		this.server_port = server_port;
		this.ticket = ticket;
	}

	override serialize(): Uint8Array {
		const writer = new MemoryWriter();
		writer.writeUint16(TicketToWorldServerMessage.id);
		writer.writeUint32(this.unknown_1);
		writer.write(new Uint8Array(this.self_ip.split(".").map(octet => parseInt(octet, 10))));
		writer.write(new Uint8Array(this.server_ip.split(".").map(octet => parseInt(octet, 10))));
		writer.writeUint16(this.server_port);
		writer.write(this.ticket);
		return writer.getBuffer();
	}

	override deserialize(data: MemoryReader): void {
		this.unknown_1 = data.readUint32();
		this.self_ip = data.read(4).reduce((acc, byte) => acc + byte.toString() + ".", "").slice(0, -1);
		this.server_ip = data.read(4).reduce((acc, byte) => acc + byte.toString() + ".", "").slice(0, -1);
		this.server_port = data.readUint16();
		this.ticket = data.read(8);
	}

	override toString(): string {
		return `TicketToWorldServerMessage(self_ip: ${this.self_ip}, server_ip: ${this.server_ip}, server_port: ${this.server_port}, ticket: [${Array.from(this.ticket).join(", ")}])`;
	}
}