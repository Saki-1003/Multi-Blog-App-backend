/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `RecentRead` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecentRead_userId_postId_key" ON "RecentRead"("userId", "postId");
