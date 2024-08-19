-- AlterTable
ALTER TABLE `cars` ADD COLUMN `excess_houre_charge` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `excess_houre_free` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `excess_price` INTEGER NOT NULL DEFAULT 0;
