/*
  Warnings:

  - You are about to alter the column `salary` on the `vacancies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `companie` on the `vacancies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `vacancies` MODIFY `salary` INTEGER NOT NULL,
    MODIFY `companie` INTEGER NOT NULL;
