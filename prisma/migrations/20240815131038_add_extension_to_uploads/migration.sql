-- AlterTable
ALTER TABLE `uploads` ADD COLUMN `extension` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `uploads` ADD CONSTRAINT `uploads_ref_id_fkey` FOREIGN KEY (`ref_id`) REFERENCES `cars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
