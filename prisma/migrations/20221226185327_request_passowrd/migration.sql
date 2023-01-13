-- CreateTable
CREATE TABLE `RequestPassword` (
    `request` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `id` INTEGER NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`request`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
