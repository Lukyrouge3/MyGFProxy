export class RC4 {
	private S = new Uint8Array(256);
	private i = 0;
	private j = 0;

	constructor(key: Uint8Array) {
		// KSA
		for (let i = 0; i < 256; i++) this.S[i] = i;

		let j = 0;
		for (let i = 0; i < 256; i++) {
			j = (j + this.S[i] + key[i % key.length]) & 0xff;
			[this.S[i], this.S[j]] = [this.S[j], this.S[i]];
		}
	}

	update(data: Uint8Array): Uint8Array {
		const out = new Uint8Array(data.length);

		// PRGA
		for (let k = 0; k < data.length; k++) {
			this.i = (this.i + 1) & 0xff;
			this.j = (this.j + this.S[this.i]) & 0xff;
			[this.S[this.i], this.S[this.j]] = [this.S[this.j], this.S[this.i]];
			const K = this.S[(this.S[this.i] + this.S[this.j]) & 0xff];
			out[k] = data[k] ^ K;
		}

		return out;
	}
}
