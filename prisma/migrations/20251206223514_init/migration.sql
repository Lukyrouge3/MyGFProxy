-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('LOGIN_CLIENT', 'LOGIN_SERVER', 'WORLD_CLIENT', 'WORLD_SERVER', 'ZONE_CLIENT', 'ZONE_SERVER');

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "command_id" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "serializedContent" JSONB,
    "content" BYTEA NOT NULL,
    "origin" "Origin" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
