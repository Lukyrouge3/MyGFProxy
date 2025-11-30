import { MemoryReader } from "../../io/reader.ts";
import { Message } from "../message.ts";

export class TicketToWorldServerMessage extends Message {
	public static override id = 4;

	public self_ip: string;
	public server_ip: string;
	public server_port: number;
	public ticket: Uint8Array;

	constructor(self_ip: string = "", server_ip: string = "", server_port: number = 0, ticket: Uint8Array = new Uint8Array()) {
		super();
		this.self_ip = self_ip;
		this.server_ip = server_ip;
		this.server_port = server_port;
		this.ticket = ticket;
	}

	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}

	override deserialize(data: MemoryReader): void {
		data.skip(4);
		this.self_ip = data.read(4).reduce((acc, byte) => acc + byte.toString() + ".", "").slice(0, -1);
		this.server_ip = data.read(4).reduce((acc, byte) => acc + byte.toString() + ".", "").slice(0, -1);
		this.server_port = data.readUint16();
		this.ticket = data.read(8);
	}

	override toString(): string {
		return `TicketToWorldServerMessage(self_ip: ${this.self_ip}, server_ip: ${this.server_ip}, server_port: ${this.server_port}, ticket: [${Array.from(this.ticket).join(", ")}])`;
	}
}