/*
  Warnings:

  - You are about to alter the column `ref_id` on the `uploads` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `uploads` MODIFY `ref_id` INTEGER NOT NULL;
