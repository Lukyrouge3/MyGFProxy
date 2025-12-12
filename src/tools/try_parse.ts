import { MemoryReader } from "../io/reader.ts";
import { ZoneServerMoveSelfMessage } from "../protocol/zone/movement/serverMoveSelf.ts";
import { prisma } from "../utils/prisma.ts";

const msg_id = 64803;

const db_message = await prisma.message.findUnique({
	where: { id: msg_id },
});

if (!db_message) {
	console.error(`Message with ID ${msg_id} not found.`);
	Deno.exit(1);
}

const reader = new MemoryReader(db_message.content);
reader.readUint16(); // skip command id
const msg = new ZoneServerMoveSelfMessage();
msg.deserialize(reader);

console.log(msg);