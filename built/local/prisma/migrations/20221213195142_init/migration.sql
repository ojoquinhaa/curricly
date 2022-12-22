-- CreateTable
CREATE TABLE `Curriculum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `tel` VARCHAR(19) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(2) NOT NULL,
    `fields` VARCHAR(191) NOT NULL,
    `formation` VARCHAR(191) NOT NULL,
    `conclusion` DATETIME(3) NOT NULL,
    `general_info` TEXT NOT NULL,
    `personal_references` TEXT NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fantasy_name` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(19) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(15) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(2) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vacancies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `fields` VARCHAR(191) NOT NULL,
    `requirements` VARCHAR(191) NOT NULL,
    `salary` VARCHAR(191) NOT NULL,
    `companie` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(15) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
