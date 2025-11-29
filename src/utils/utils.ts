function u8ToForgeBytes(u8: Uint8Array): string {
	return String.fromCharCode(...u8);
}

function forgeToU8(bytes: string): Uint8Array {
	return Uint8Array.from(bytes, c => c.charCodeAt(0));
}
export { u8ToForgeBytes, forgeToU8 };