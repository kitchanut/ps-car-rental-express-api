/*
  Warnings:

  - A unique constraint covering the columns `[page_id]` on the table `facebook_pages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `facebook_pages` MODIFY `page_status` VARCHAR(255) NOT NULL DEFAULT 'เปิดใช้งาน';

-- CreateIndex
CREATE UNIQUE INDEX `facebook_pages_page_id_key` ON `facebook_pages`(`page_id`);
