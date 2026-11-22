-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dek" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "coverImageAlt" TEXT,
    "coverImageCredit" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMPTZ(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sources" JSONB NOT NULL DEFAULT '[]',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "categoryId" UUID NOT NULL,
    "authorId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleTag" (
    "articleId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleTag_pkey" PRIMARY KEY ("articleId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "Article_categoryId_status_publishedAt_idx" ON "Article"("categoryId", "status", "publishedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "ArticleTag_tagId_idx" ON "ArticleTag"("tagId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ---------------------------------------------------------------------------------------------
-- Hand-written: guards for rows inserted directly in the database (there is no back office yet)
-- ---------------------------------------------------------------------------------------------

-- Slugs are URL segments: lowercase letters, digits and single hyphens.
ALTER TABLE "Category" ADD CONSTRAINT "Category_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "Author"   ADD CONSTRAINT "Author_slug_format"   CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "Article"  ADD CONSTRAINT "Article_slug_format"  CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "Tag"      ADD CONSTRAINT "Tag_slug_format"      CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

-- A published article needs a publication instant, and its text fields cannot be blank.
ALTER TABLE "Article" ADD CONSTRAINT "Article_published_has_date"
  CHECK ("status" <> 'published' OR "publishedAt" IS NOT NULL);
ALTER TABLE "Article" ADD CONSTRAINT "Article_text_not_blank"
  CHECK (btrim("title") <> '' AND btrim("dek") <> '' AND btrim("body") <> '');
ALTER TABLE "Article" ADD CONSTRAINT "Article_sources_is_array"
  CHECK (jsonb_typeof("sources") = 'array');

-- Keep "updatedAt" current on manual UPDATEs (Prisma's @updatedAt only covers writes made by Prisma).
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW."updatedAt" := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "Category_set_updatedAt"   BEFORE UPDATE ON "Category"   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER "Author_set_updatedAt"     BEFORE UPDATE ON "Author"     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER "Article_set_updatedAt"    BEFORE UPDATE ON "Article"    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER "Tag_set_updatedAt"        BEFORE UPDATE ON "Tag"        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER "ArticleTag_set_updatedAt" BEFORE UPDATE ON "ArticleTag" FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Supabase exposes the public schema through its REST API (anon / authenticated roles).
-- RLS with no policies closes that door; the app connects as the owner, which bypasses RLS.
ALTER TABLE "Category"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Author"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArticleTag" ENABLE ROW LEVEL SECURITY;
