-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_branch_id_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `branch_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
