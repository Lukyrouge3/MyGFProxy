import { PNG } from "npm:pngjs";
import { writeFile } from "node:fs/promises";
import ac from "@antiadmin/anticaptchaofficial";
import { Buffer } from "node:buffer";
// Read file

// Auto-detect header
const WIDTH = 170;
const HEIGHT = 64;

ac.setAPIKey(Deno.env.get("ANTI_CAPTCHA_KEY") || "");
ac.shutUp();

export async function rawToPng(data: Uint8Array) {
	if (data.length !== WIDTH * HEIGHT) {
		throw new Error(`Bad image size: ${data.length}`);
	}

	const png = new PNG({ width: WIDTH, height: HEIGHT });

	for (let i = 0; i < WIDTH * HEIGHT; i++) {
		const v = data[i];        // grayscale value
		png.data[i * 4 + 0] = v;  // R
		png.data[i * 4 + 1] = v;  // G
		png.data[i * 4 + 2] = v;  // B
		png.data[i * 4 + 3] = 255; // A
	}

	const buffer = PNG.sync.write(png);
	return buffer;
}

export async function solveAndStoreCaptcha(data: Uint8Array) {

	try {
		const buffer = await rawToPng(data);
		const captcha = await ac.solveImage(buffer.toString("base64"), true);

		const outPath = `captchas/${new Date().getTime()}_${captcha}.png`;
		await writeFile(outPath, buffer);

	} catch (e) {
		console.error("Failed to solve captcha:", e);
	}

}