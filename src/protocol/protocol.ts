// Constructor type for Message subclasses. The `new()` signature lets us
// instantiate concrete message classes at runtime. Including the static

import { HelloClientMessage } from "./login/helloClientMessage.ts";
import { HelloServerMessage } from "./login/helloServerMessage.ts";
import { LoginOkayMessage } from "./login/loginOkayMessage.ts";
import { SelectWorldServerMessage } from "./login/selectWorldServerMessage.ts";
import { ServerListMessage } from "./login/serverListMessage.ts";
import { TicketToWorldServerMessage } from "./login/ticketToWorldServerMessage.ts";
import { Message } from "./message.ts";
import { WorldClientCaptcha, WorldClientGetCharacters, WorldClientGetMotionEndTime, WorldClientHello, WorldClientReceiveTicketToZoneServer, WorldClientResetTime, WorldServerCaptchaReturn, WorldServerLoginCharacter, WorldServerReceiveTicket } from "./world/index.ts";
import { ZoneServerReceiveTicket } from "./zone/index.ts";


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
	4: WorldServerCaptchaReturn,
	6: WorldServerReceiveTicket,
	9: WorldServerLoginCharacter,
	38: WorldClientHello,
	40: WorldClientReceiveTicketToZoneServer,
	41: WorldClientGetCharacters,
	43: WorldClientResetTime,
	65: WorldClientCaptcha,
	80: WorldClientGetMotionEndTime,
};

export const zone_protocol_messages: Record<number, MessageConstructor> = {
	45: ZoneServerReceiveTicket
};