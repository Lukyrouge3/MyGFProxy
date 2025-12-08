import { throws } from "node:assert";
import { TicketToWorldServerMessage } from "../../protocol/login/ticketToWorldServerMessage.ts";
import { Message } from "../../protocol/message.ts";
import { ServerCaptchaMessage } from "../../protocol/world/serverCaptchaMessage.ts";
import { rawToPng, solveAndStoreCaptcha, solveCaptcha } from "../../utils/img.ts";
import { ProxyServer } from "../proxyServer.ts";
import { CaptchaAnwserClientMessage } from "../../protocol/world/captchaAnwserClientMessage.ts";
import { Proxy } from "../proxy.ts";
import { MemoryReader } from "../../io/reader.ts";


export class WorldProxyServer extends ProxyServer {

	private captchaParts: Map<number, Uint8Array> = new Map();

	protected override handle_message(message: Message, proxy: Proxy): Uint8Array | null {
		if (message instanceof ServerCaptchaMessage) {
			this.captchaParts.set(message.part, message.image_data.subarray(0, 16 * 170));
			if (this.captchaParts.size === 4) {
				// We have all parts, combine and save
				const combined = new Uint8Array(16 * 170 * 4);
				for (let i = 1; i <= 4; i++) {
					const part = this.captchaParts.get(i);
					if (part) {
						combined.set(part, (i - 1) * 16 * 170);
					}
				}

				const msg = new CaptchaAnwserClientMessage();
				solveCaptcha(combined).then((captcha) => {
					msg.answer = captcha;
					proxy.client.handle_raw_packet(new MemoryReader(msg.serialize()), proxy, true);
				});

				this.captchaParts.clear();
			}
			return null;
		}

		return null;
	}
}