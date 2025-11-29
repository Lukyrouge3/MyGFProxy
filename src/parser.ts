import { MemoryReader } from "./io/reader.ts";
import { ServerListMessage } from "./protocol/login/serverListMessage.ts";

const path = "bins/server_command_6_packet.bin";
const file = Deno.readFileSync(path);

const reader = new MemoryReader(file);
reader.skip(2); // Skip the last 2 bytes (assumed command ID)

const serverListMessage = new ServerListMessage();
serverListMessage.deserialize(reader);

console.log("Deserialized ServerListMessage:", serverListMessage);