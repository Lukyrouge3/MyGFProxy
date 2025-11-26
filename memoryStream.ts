export class MemoryStream {
	private buffer: Uint8Array;
	constructor(size: number) {
		this.buffer = new Uint8Array(size);
	}

	// appends data to the buffer at the given offset
	public write(data: Uint8Array) {
		if (data.length > this.buffer.length) {
			// Resize buffer
			const newBuffer = new Uint8Array(data.length);
			newBuffer.set(this.buffer);
			this.buffer = newBuffer;
		}
		this.buffer.set(data, this.buffer.length - data.length);
	}

	public read(length: number): Uint8Array {
		if (length > this.buffer.length) {
			length = this.buffer.length;
		}
		const bytes = this.buffer.subarray(0, length);
		this.buffer = this.buffer.subarray(length);
		return bytes;
	}

	public length(): number {
		return this.buffer.length;
	}

	public readUint16(offset: number, littleEndian: boolean = true): number {
		const view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
		const value = view.getUint16(offset, littleEndian);
		this.buffer = this.buffer.subarray(2);
		return value;
	}

	public getBuffer(): Uint8Array {
		return this.buffer;
	}
}