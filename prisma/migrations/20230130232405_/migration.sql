/*
  Warnings:

  - Added the required column `petId` to the `AdoptionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adoptionrequest` ADD COLUMN `petId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `AdoptionRequest` ADD CONSTRAINT `AdoptionRequest_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
