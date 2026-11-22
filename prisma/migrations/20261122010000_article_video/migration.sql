-- CreateEnum
CREATE TYPE "VideoOrientation" AS ENUM ('landscape', 'portrait');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN "youtubeVideoId" TEXT,
ADD COLUMN "videoOrientation" "VideoOrientation" NOT NULL DEFAULT 'landscape';

-- Hand-written: YouTube ids are 11 characters of [A-Za-z0-9_-].
ALTER TABLE "Article" ADD CONSTRAINT "Article_youtubeVideoId_format"
  CHECK ("youtubeVideoId" IS NULL OR "youtubeVideoId" ~ '^[A-Za-z0-9_-]{11}$');
