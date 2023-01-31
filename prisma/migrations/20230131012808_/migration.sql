/*
  Warnings:

  - You are about to alter the column `accepted` on the `adoptionrequest` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `adoptionrequest` MODIFY `accepted` VARCHAR(191) NOT NULL DEFAULT 'pending';
