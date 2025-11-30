import { MemoryReader } from "../io/reader.ts";
import { Serializable } from "../io/serializable.ts";

export abstract class Message extends Serializable {
	public static id: number;

	/**
	 * 
	 * @param data A memory reader where the 2 bytes of the command ID are already read.
	 */
	abstract override deserialize(data: MemoryReader): void;
}