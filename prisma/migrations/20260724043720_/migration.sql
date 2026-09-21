-- CreateTable
CREATE TABLE "RecentRead" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "RecentRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteSite" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "siteId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteAuthor" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteSite_userId_siteId_key" ON "FavoriteSite"("userId", "siteId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteAuthor_userId_authorId_key" ON "FavoriteAuthor"("userId", "authorId");

-- AddForeignKey
ALTER TABLE "RecentRead" ADD CONSTRAINT "RecentRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentRead" ADD CONSTRAINT "RecentRead_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteSite" ADD CONSTRAINT "FavoriteSite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteSite" ADD CONSTRAINT "FavoriteSite_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "BlogSite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAuthor" ADD CONSTRAINT "FavoriteAuthor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAuthor" ADD CONSTRAINT "FavoriteAuthor_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
