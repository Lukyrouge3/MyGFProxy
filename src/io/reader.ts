import { Serializable } from "./serializable.ts";

export class MemoryReader {
	private buffer: Uint8Array;
	private offset: number;

	constructor(buffer: Uint8Array) {
		this.buffer = buffer;
		this.offset = 0;
	}

	private get view(): DataView {
		return new DataView(this.buffer.buffer, this.buffer.byteOffset + this.offset, this.buffer.byteLength - this.offset);
	}

	public readUint16(littleEndian: boolean = true): number {
		const value = this.view.getUint16(0, littleEndian);
		this.offset += 2;
		return value;
	}

	public readUInt8(): number {
		const value = this.view.getUint8(0);
		this.offset += 1;
		return value;
	}

	public readString(): string {
		const len = this.readUint16();
		const str_bytes = this.buffer.subarray(this.offset, this.offset + len);
		this.offset += len;
		return new TextDecoder().decode(str_bytes);
	}

	public skip(bytes: number) {
		this.offset += bytes;
	}

	// Read an array of Serializable items. Provide the class constructor so
	// we can instantiate the concrete type at runtime (TypeScript generics
	// cannot be directly constructed).
	public readArray<T extends Serializable>(ctor: { new(): T }): T[] {
		const array_length = this.readUint16();
		const arr: T[] = [];
		for (let i = 0; i < array_length; i++) {
			const item = new ctor();
			item.deserialize(this);
			arr.push(item);
		}
		return arr;
	}

	public get currentOffset(): number {
		return this.offset;
	}

	public length(): number {
		return this.buffer.length - this.offset;
	}

	public read(length: number): Uint8Array {
		const data = this.buffer.subarray(this.offset, this.offset + length);
		this.offset += length;
		return data;
	}

	public copy(): MemoryReader {
		const newReader = new MemoryReader(this.buffer.subarray(this.offset, this.buffer.length));
		return newReader;
	}

	public getBuffer(): Uint8Array {
		return this.buffer.subarray(this.offset, this.buffer.length);
	}
}