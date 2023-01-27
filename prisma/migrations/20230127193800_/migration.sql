/*
  Warnings:

  - Added the required column `NewPetOwner` to the `AdoptionProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adoptionprofile` ADD COLUMN `NewPetOwner` BOOLEAN NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `preferedTypes` JSON NULL,
    ADD COLUMN `state` VARCHAR(191) NULL,
    MODIFY `cep` VARCHAR(191) NULL;
