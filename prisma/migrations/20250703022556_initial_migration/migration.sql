-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChildContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "videoUrl" TEXT NOT NULL,
    "posterImage" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TechnicalInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formato" TEXT NOT NULL,
    "duracion" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "publico" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "empresaProductora" TEXT NOT NULL,
    "paisProductora" TEXT NOT NULL,
    "empresaCoproductora" TEXT,
    "paisCoproductora" TEXT,
    "childContentId" TEXT NOT NULL,
    CONSTRAINT "TechnicalInfo_childContentId_fkey" FOREIGN KEY ("childContentId") REFERENCES "ChildContent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "festival" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "childContentId" TEXT NOT NULL,
    CONSTRAINT "Award_childContentId_fkey" FOREIGN KEY ("childContentId") REFERENCES "ChildContent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "childContentId" TEXT NOT NULL,
    CONSTRAINT "Platform_childContentId_fkey" FOREIGN KEY ("childContentId") REFERENCES "ChildContent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdditionalInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pressbook" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "childContentId" TEXT NOT NULL,
    CONSTRAINT "AdditionalInfo_childContentId_fkey" FOREIGN KEY ("childContentId") REFERENCES "ChildContent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "imagenDark" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceFeature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "serviceId" TEXT NOT NULL,
    CONSTRAINT "ServiceFeature_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageLight" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "metadata" TEXT,
    "content" TEXT,
    "mainImage" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "infinite_content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChildContent_slug_key" ON "ChildContent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalInfo_childContentId_key" ON "TechnicalInfo"("childContentId");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalInfo_childContentId_key" ON "AdditionalInfo"("childContentId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_nombre_cargo_key" ON "TeamMember"("nombre", "cargo");

-- CreateIndex
CREATE UNIQUE INDEX "Service_title_key" ON "Service"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceFeature_serviceId_title_key" ON "ServiceFeature"("serviceId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteConfig_key_key" ON "SiteConfig"("key");
