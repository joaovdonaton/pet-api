-- DropForeignKey
ALTER TABLE `adoptionprofile` DROP FOREIGN KEY `AdoptionProfile_userId_fkey`;

-- AddForeignKey
ALTER TABLE `AdoptionProfile` ADD CONSTRAINT `AdoptionProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
