/*
  Warnings:

  - You are about to drop the column `longitute` on the `adoptionprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `adoptionprofile` DROP COLUMN `longitute`,
    ADD COLUMN `longitude` DOUBLE NOT NULL DEFAULT 0.0;
