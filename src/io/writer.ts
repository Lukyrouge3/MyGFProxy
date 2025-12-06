export class MemoryWriter {
	private buffer: Uint8Array;

	constructor() {
		this.buffer = new Uint8Array(0);
	}

	private resize(newSize: number) {
		const newBuffer = new Uint8Array(newSize);
		newBuffer.set(this.buffer, 0);
		this.buffer = newBuffer;
	}

	private get view(): DataView {
		return new DataView(this.buffer.buffer);
	}

	public writeUint16(value: number, littleEndian: boolean = true) {
		this.resize(this.buffer.length + 2);
		this.view.setUint16(this.buffer.length - 2, value, littleEndian);
	}

	public write(data: Uint8Array) {
		const oldLength = this.buffer.length;
		this.resize(oldLength + data.length);
		this.buffer.set(data, oldLength);
	}

	public writeUint32(value: number, littleEndian: boolean = true) {
		this.resize(this.buffer.length + 4);
		this.view.setUint32(this.buffer.length - 4, value, littleEndian);
	}

	public skip(bytes: number) {
		this.resize(this.buffer.length + bytes);
	}

	public getBuffer(): Uint8Array {
		return this.buffer;
	}

	public writeString(value: string) {
		this.writeUint16(value.length);
		const encoded = new TextEncoder().encode(value);
		this.write(encoded);
	}
}