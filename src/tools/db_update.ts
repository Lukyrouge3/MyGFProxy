// Basically a simple script to get all messages with null serializedContent AND OR name == 'UnknownMessage' and try to re-process them.

import { Origin } from "../generated/enums.ts";
import { MemoryReader } from "../io/reader.ts";
import { login_protocol_messages, world_protocol_messages, zone_protocol_messages } from "../protocol/protocol.ts";
import { prisma } from "../utils/prisma.ts";

const messages = await prisma.message.findMany({
	where: {
		OR: [
			{ serializedContent: undefined },
			{ name: "UnknownMessage" },
		],
	},
});

const updates: Parameters<typeof prisma.message.update>[0][] = [];
let failCount = 0;

for (const msg of messages) {
	let protocol_msgs = login_protocol_messages;
	if (msg.origin === Origin.WORLD_CLIENT || msg.origin === Origin.WORLD_SERVER) protocol_msgs = world_protocol_messages;
	else if (msg.origin === Origin.ZONE_CLIENT || msg.origin === Origin.ZONE_SERVER) protocol_msgs = zone_protocol_messages;

	const MessageCtor = protocol_msgs[msg.command_id];
	if (!MessageCtor) {
		continue;
	}
	const message = new MessageCtor();
	const reader = new MemoryReader(msg.content);
	reader.readUint16(); // skip command id
	try {
		message.deserialize(reader);
		updates.push({
			where: { id: msg.id },
			data: {
				serializedContent: JSON.parse(JSON.stringify(message)),
				name: message.constructor.name,
			},
		});
		console.log(`Queued message ID ${msg.id} with name ${message.constructor.name}`);
	} catch (e) {
		console.error(`Failed to deserialize message ID ${msg.id}:`, e);
		failCount++;
	}
}

console.log(`\nPrepared ${updates.length} updates, starting execution...`);
// Execute updates in batches of 100
const BATCH_SIZE = 100;
for (let i = 0; i < updates.length; i += BATCH_SIZE) {
	const batch = updates.slice(i, i + BATCH_SIZE);
	await prisma.$transaction(async (tx) => {
		for (const u of batch) {
			await tx.message.update(u);
		}
	}, {
		timeout: 30000, // 30 seconds per batch
	});
	console.log(`Executed batch ${Math.floor(i / BATCH_SIZE) + 1}, ${batch.length} updates`);
}

console.log(`\nDone! Updated ${updates.length} messages, ${failCount} failed.`);