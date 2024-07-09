-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_receivedById_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_sentById_fkey`;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_sentById_fkey` FOREIGN KEY (`sentById`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receivedById_fkey` FOREIGN KEY (`receivedById`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
