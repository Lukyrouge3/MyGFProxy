import { PrismaPg } from "npm:@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.ts";

const connectionString = `${Deno.env.get("DATABASE_URL")}`;
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });