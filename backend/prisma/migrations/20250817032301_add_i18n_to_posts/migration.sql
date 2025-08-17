/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('PT_BR', 'EN_US');

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "defaultLanguage" "public"."Language" NOT NULL DEFAULT 'EN_US';

-- CreateTable
CREATE TABLE "public"."PostTranslation" (
    "id" SERIAL NOT NULL,
    "language" "public"."Language" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "PostTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostTranslation_postId_language_key" ON "public"."PostTranslation"("postId", "language");

-- AddForeignKey
ALTER TABLE "public"."PostTranslation" ADD CONSTRAINT "PostTranslation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
