-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Mut" AS ENUM ('NAN', 'M15', 'M45', 'H8', 'FOREVER');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('PRIVATE', 'PROTECTED', 'PUBLIC', 'PERSONEL');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "hashedRT" TEXT,
    "gameWon" INTEGER,
    "gameLost" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "achievements" TEXT[],
    "twoFactorAuthenticationSecret" TEXT,
    "isTwoFactorAuthenticationEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match_History" (
    "id" TEXT NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "game_end" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user1P" INTEGER NOT NULL,
    "user2P" INTEGER NOT NULL,

    CONSTRAINT "Match_History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "friendID" INTEGER NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "isRequested" BOOLEAN NOT NULL DEFAULT false,
    "isFriend" BOOLEAN NOT NULL DEFAULT false,
    "requestAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "channelID" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "mut" "Mut" NOT NULL DEFAULT 'NAN',
    "blocked_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("channelID","userID")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "ownerId" INTEGER,
    "type" "Type" NOT NULL DEFAULT 'PERSONEL',
    "name" TEXT,
    "hash" TEXT,
    "image" TEXT,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "hasblocked" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "msgs" (
    "id" TEXT NOT NULL,
    "channelID" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "timeSend" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "msgs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "channels_name_key" ON "channels"("name");

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
ALTER TABLE "channels" ADD CONSTRAINT "channels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_hasblocked_fkey" FOREIGN KEY ("hasblocked") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msgs" ADD CONSTRAINT "msgs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msgs" ADD CONSTRAINT "msgs_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
