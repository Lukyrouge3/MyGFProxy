import { MemoryReader } from "./io/reader.ts";
import { HelloServerMessage } from "./protocol/login/helloServerMessage.ts";
import { LoginProxy } from "./proxy/login/loginProxy.ts";
import { WorldProxy } from "./proxy/world/worldProxy.ts";
import { ZoneProxy } from "./proxy/zone/zoneProxy.ts";
import { Logger } from "./utils/logger.ts";
import { prisma } from "./utils/prisma.ts";

const logger = new Logger("Main");

const session = await prisma.session.create({});
logger.debug(`Created session with ID: ${session.id}`);

const login_proxy = new LoginProxy(session.id);
logger.info("Started Login proxy");
const world_proxy = new WorldProxy(session.id);
logger.info("Started World proxy");
const zone_proxy = new ZoneProxy(session.id);
logger.info("Started Zone proxy");