/*
  Warnings:

  - A unique constraint covering the columns `[booking_id]` on the table `booking_pickups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[booking_id]` on the table `booking_returns` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `booking_pickups_booking_id_key` ON `booking_pickups`(`booking_id`);

-- CreateIndex
CREATE UNIQUE INDEX `booking_returns_booking_id_key` ON `booking_returns`(`booking_id`);
