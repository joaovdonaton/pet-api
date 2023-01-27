/*
  Warnings:

  - You are about to drop the column `animal` on the `pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pet` DROP COLUMN `animal`,
    ADD COLUMN `typeId` VARCHAR(191) NOT NULL DEFAULT 'dog';

-- CreateTable
CREATE TABLE `PetType` (
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdoptionProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cep` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AdoptionProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `PetType`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdoptionProfile` ADD CONSTRAINT `AdoptionProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
