// Constructor type for Message subclasses. The `new()` signature lets us
// instantiate concrete message classes at runtime. Including the static

import { ServerListMessage } from "./login/serverListMessage.ts";
import { TicketToWorldServerMessage } from "./login/ticketToWorldServerMessage.ts";
import { Message } from "./message.ts";

// `id` property on the constructor lets callers access the message id if needed.
export type MessageConstructor = { new(): Message; id: number };

export const login_protocol_messages: Record<number, MessageConstructor> = {
	6: ServerListMessage,
	7: TicketToWorldServerMessage,
};