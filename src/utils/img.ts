import { PNG } from "npm:pngjs";
import { writeFile } from "node:fs/promises";
import ac from "@antiadmin/anticaptchaofficial";
import { Buffer } from "node:buffer";
import * as ort from "npm:onnxruntime-web";
// Read file

// Auto-detect header
const WIDTH = 170;
const HEIGHT = 64;

ac.setAPIKey(Deno.env.get("ANTI_CAPTCHA_KEY") || "");
ac.shutUp();
ac.settings.numeric = 1;
ac.settings.minLength = 4;
ac.settings.maxLength = 4;

const session = await ort.InferenceSession.create(
	await Deno.readFile("model/captcha_model_single.onnx"),
	{ executionProviders: ["wasm"] } // works everywhere
);

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

		let outPath = `captchas/images/${new Date().getTime()}_${captcha}.png`;
		await writeFile(outPath, buffer);
		outPath = `captchas/bins/${new Date().getTime()}_${captcha}.bin`;
		await writeFile(outPath, data);

	} catch (e) {
		console.error("Failed to solve captcha:", e);
	}

}

export async function solveCaptcha(data: Uint8Array): Promise<string> {
	const input = new Float32Array(data.length);

	for (let i = 0; i < data.length; i++) {
		input[i] = data[i] / 255.0; // normalize EXACTLY like training
	}

	const inputTensor = new ort.Tensor(
		"float32",
		input,
		[1, 1, 64, 170]
	);

	const results = await session.run({ input: inputTensor });
	const output = results.output.data as Float32Array; // shape [1,4,10]

	let result = "";
	for (let i = 0; i < 4; i++) {
		let best = 0;
		let max = -Infinity;
		for (let d = 0; d < 10; d++) {
			const v = output[i * 10 + d];
			if (v > max) {
				max = v;
				best = d;
			}
		}
		result += best.toString();
	}

	return result;
}