/*
  Warnings:

  - You are about to drop the `CHANNEL` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FRIENDSHIP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MESSAGES` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PARTICIPANTS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CHANNEL" DROP CONSTRAINT "CHANNEL_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "FRIENDSHIP" DROP CONSTRAINT "FRIENDSHIP_friendID_fkey";

-- DropForeignKey
ALTER TABLE "FRIENDSHIP" DROP CONSTRAINT "FRIENDSHIP_userID_fkey";

-- DropForeignKey
ALTER TABLE "MESSAGES" DROP CONSTRAINT "MESSAGES_channelID_fkey";

-- DropForeignKey
ALTER TABLE "MESSAGES" DROP CONSTRAINT "MESSAGES_userId_fkey";

-- DropForeignKey
ALTER TABLE "Match_History" DROP CONSTRAINT "Match_History_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Match_History" DROP CONSTRAINT "Match_History_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "PARTICIPANTS" DROP CONSTRAINT "PARTICIPANTS_channelID_fkey";

-- DropForeignKey
ALTER TABLE "PARTICIPANTS" DROP CONSTRAINT "PARTICIPANTS_userID_fkey";

-- DropTable
DROP TABLE "CHANNEL";

-- DropTable
DROP TABLE "FRIENDSHIP";

-- DropTable
DROP TABLE "MESSAGES";

-- DropTable
DROP TABLE "PARTICIPANTS";

-- DropTable
DROP TABLE "USER";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "gameWon" INTEGER NOT NULL,
    "gameLost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "achievements" TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "friendID" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "isRequested" BOOLEAN NOT NULL,
    "isFriend" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "channelID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "mut" "Mut" NOT NULL DEFAULT 'NAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("channelID","userID")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'PRIVATE',
    "name" TEXT NOT NULL,
    "hash" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "msgs" (
    "id" TEXT NOT NULL,
    "channelID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timeSend" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "msgs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "msgs_channelID_key" ON "msgs"("channelID");

-- AddForeignKey
ALTER TABLE "Match_History" ADD CONSTRAINT "Match_History_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_History" ADD CONSTRAINT "Match_History_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friendID_fkey" FOREIGN KEY ("friendID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msgs" ADD CONSTRAINT "msgs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msgs" ADD CONSTRAINT "msgs_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
