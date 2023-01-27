/*
  Warnings:

  - You are about to drop the column `NewPetOwner` on the `adoptionprofile` table. All the data in the column will be lost.
  - Added the required column `newPetOwner` to the `AdoptionProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adoptionprofile` DROP COLUMN `NewPetOwner`,
    ADD COLUMN `newPetOwner` BOOLEAN NOT NULL;
