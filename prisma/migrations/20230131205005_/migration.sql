-- DropForeignKey
ALTER TABLE `adoptionrequest` DROP FOREIGN KEY `AdoptionRequest_petId_fkey`;

-- DropForeignKey
ALTER TABLE `adoptionrequest` DROP FOREIGN KEY `AdoptionRequest_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `adoptionrequest` DROP FOREIGN KEY `AdoptionRequest_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `pet` DROP FOREIGN KEY `Pet_ownerId_fkey`;

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdoptionRequest` ADD CONSTRAINT `AdoptionRequest_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdoptionRequest` ADD CONSTRAINT `AdoptionRequest_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdoptionRequest` ADD CONSTRAINT `AdoptionRequest_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
