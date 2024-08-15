/*
  Warnings:

  - Added the required column `car_status` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cars` ADD COLUMN `car_status` VARCHAR(255) NOT NULL;
