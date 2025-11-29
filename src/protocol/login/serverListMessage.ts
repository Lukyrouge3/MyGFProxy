import { MemoryReader } from "../../io/reader.ts";
import { Serializable } from "../../io/serializable.ts";
import { Message } from "../message.ts";

export class ServerListMessage extends Message {
	public static override id = 6;

	public servers: WorldServer[] = [];
	public last_selected_server_id: number = 0;

	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}
	override deserialize(data: MemoryReader): void {
		this.servers = data.readArray(WorldServer);
		this.last_selected_server_id = data.readUint16();
	}

	override toString(): string {
		return `ServerListMessage(Servers: [${this.servers.join(", ")}], LastSelectedServerID: ${this.last_selected_server_id})`;
	}
}

export class WorldServer extends Serializable {
	public id!: number;
	public name!: string;
	public player_count!: number;
	public status!: number;
	public game_version_match!: number;
	public character_count!: number;

	override serialize(): Uint8Array {
		throw new Error("Method not implemented.");
	}

	override deserialize(data: MemoryReader): void {
		this.id = data.readUint16();
		this.name = data.readString();
		data.skip(8);
		this.player_count = data.readUint16();
		this.status = data.readUint16();
		this.game_version_match = data.readUint16();
		this.character_count = data.readUint16();
		data.skip(2);
	}

	override toString(): string {
		return `WorldServer(ID: ${this.id}, Name: ${this.name}, Players: ${this.player_count}, Status: ${this.status}, Version Match: ${this.game_version_match}, Characters: ${this.character_count})`;
	}
}