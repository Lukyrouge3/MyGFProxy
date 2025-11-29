import fs from "node:fs";

export const Colors = {
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",

	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",

	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m",
};

export class Logger {
	private class_name;
	private static start_date = new Date();

	constructor(class_name: string) {
		this.class_name = class_name;
		// Check if logs directory exists and create it if it doesn't.
		if (!fs.existsSync("logs")) {
			fs.mkdirSync("logs");
		}
	}

	private date() {
		return `${Colors.Dim}${new Date().toLocaleString("fr-CH")}${Colors.Reset}`;
	}

	public info(message: string) {
		const msg = `${this.date()} [INFO] ${this.class_name} ${Colors.FgCyan}${message}${Colors.Reset}`;
		console.log(msg);
		this.log(msg);
	}

	public debug(...message: unknown[]) {
		if (Deno.env.get("environment") !== "debug") return;
		console.log(
			`${this.date()} [DEBUG] ${this.class_name}${Colors.Dim}`,
			...message,
			`${Colors.Reset}`,
		);
	}

	public error(message: string) {
		const msg = `${this.date()} [ERROR] ${this.class_name} ${Colors.FgRed}${message}${Colors.Reset}`;
		console.error(msg);
		this.log(msg);
	}

	public warn(message: string) {
		const msg = `${this.date()} [WARNING] ${this.class_name} ${Colors.FgYellow}${message}${Colors.Reset}`;
		console.warn(msg);
		this.log(msg);
	}

	private log(msg: string) {
		// fs.appendFileSync(
		// 	`logs/${Logger.start_date.toISOString()}.log`,
		// 	`${msg}\n`,
		// );
	}
}