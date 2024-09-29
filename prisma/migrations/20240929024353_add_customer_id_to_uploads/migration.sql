-- AlterTable
ALTER TABLE `uploads` ADD COLUMN `customer_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `uploads` ADD CONSTRAINT `uploads_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
