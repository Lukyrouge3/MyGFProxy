import { MemoryReader } from "./reader.ts";

export abstract class Serializable {
	abstract serialize(): Uint8Array;
	abstract deserialize(data: MemoryReader): void;

	abstract toString(): string;
}