/*
  Warnings:

  - Made the column `cep` on table `adoptionprofile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `adoptionprofile` MODIFY `cep` VARCHAR(191) NOT NULL;
