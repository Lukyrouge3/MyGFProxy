// Constructor type for Message subclasses. The `new()` signature lets us
// instantiate concrete message classes at runtime. Including the static

import { HelloClientMessage } from "./login/helloClientMessage.ts";
import { HelloServerMessage } from "./login/helloServerMessage.ts";
import { LoginOkayMessage } from "./login/loginOkayMessage.ts";
import { SelectWorldServerMessage } from "./login/selectWorldServerMessage.ts";
import { ServerListMessage } from "./login/serverListMessage.ts";
import { TicketToWorldServerMessage } from "./login/ticketToWorldServerMessage.ts";
import { Message } from "./message.ts";
import { ServerCaptchaMessage } from "./world/serverCaptchaMessage.ts";
import { WorldHelloClientMessage } from "./world/worldhelloClientMessage.ts";

// `id` property on the constructor lets callers access the message id if needed.
export type MessageConstructor = { new(): Message; id: number };

export const login_protocol_messages: Record<number, MessageConstructor> = {
	2: SelectWorldServerMessage,
	3: HelloClientMessage,
	4: HelloServerMessage,
	6: ServerListMessage,
	7: TicketToWorldServerMessage,
	8: LoginOkayMessage,
};

export const world_protocol_messages: Record<number, MessageConstructor> = {
	6: WorldHelloClientMessage,
	65: ServerCaptchaMessage,
};