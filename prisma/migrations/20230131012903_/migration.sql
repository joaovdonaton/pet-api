/*
  Warnings:

  - You are about to drop the column `accepted` on the `adoptionrequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `adoptionrequest` DROP COLUMN `accepted`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending';
