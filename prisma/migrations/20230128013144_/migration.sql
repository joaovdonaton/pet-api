/*
  Warnings:

  - You are about to drop the column `Latitude` on the `adoptionprofile` table. All the data in the column will be lost.
  - You are about to drop the column `Longitute` on the `adoptionprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `adoptionprofile` DROP COLUMN `Latitude`,
    DROP COLUMN `Longitute`,
    ADD COLUMN `latitude` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `longitute` DOUBLE NOT NULL DEFAULT 0.0;
