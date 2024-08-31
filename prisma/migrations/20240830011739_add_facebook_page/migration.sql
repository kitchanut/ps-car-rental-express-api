-- CreateTable
CREATE TABLE `facebook_pages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `access_token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
