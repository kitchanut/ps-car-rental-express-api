/*
  Warnings:

  - You are about to drop the column `access_token` on the `facebook_pages` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `facebook_pages` table. All the data in the column will be lost.
  - Added the required column `page_access_token` to the `facebook_pages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page_name` to the `facebook_pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `facebook_pages` DROP COLUMN `access_token`,
    DROP COLUMN `name`,
    ADD COLUMN `page_access_token` VARCHAR(255) NOT NULL,
    ADD COLUMN `page_name` VARCHAR(255) NOT NULL;
