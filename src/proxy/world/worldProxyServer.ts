import { throws } from "node:assert";
import { TicketToWorldServerMessage } from "../../protocol/login/ticketToWorldServerMessage.ts";
import { Message } from "../../protocol/message.ts";
import { ServerCaptchaMessage } from "../../protocol/world/serverCaptchaMessage.ts";
import { rawToPng, solveAndStoreCaptcha } from "../../utils/img.ts";
import { ProxyServer } from "../proxyServer.ts";
import { CaptchaAnwserClientMessage } from "../../protocol/world/captchaAnwserClientMessage.ts";
import { Proxy } from "../proxy.ts";
import { MemoryReader } from "../../io/reader.ts";


export class WorldProxyServer extends ProxyServer {

	private captchaParts: Map<number, Uint8Array> = new Map();
	private captchaCount = 0;

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
				solveAndStoreCaptcha(combined).then(() => {
					this.logger.debug(`Solved captcha and stored image`);
				});

				const msg = new CaptchaAnwserClientMessage();
				msg.answer = "0000";

				//wait 1 second before sending the answer
				setTimeout(() => {


					proxy.client.handle_raw_packet(new MemoryReader(msg.serialize()), proxy, true);
				}, 1000);


				this.captchaParts.clear();
				this.captchaCount++;
			}
			if (this.captchaCount === 3) {
				// After solving 3 captchas, reset the count and close the connection
				this.captchaCount = 0;
				this.message_count = 0;
			}
			return null;
		}

		return null;
	}
}