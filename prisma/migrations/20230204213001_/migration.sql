/*
  Warnings:

  - You are about to drop the `_organizationtouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_organizationtouser` DROP FOREIGN KEY `_OrganizationToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_organizationtouser` DROP FOREIGN KEY `_OrganizationToUser_B_fkey`;

-- AlterTable
ALTER TABLE `organization` ADD COLUMN `ownerId` INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `_organizationtouser`;

-- CreateTable
CREATE TABLE `_member` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_member_AB_unique`(`A`, `B`),
    INDEX `_member_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_member` ADD CONSTRAINT `_member_A_fkey` FOREIGN KEY (`A`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_member` ADD CONSTRAINT `_member_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
