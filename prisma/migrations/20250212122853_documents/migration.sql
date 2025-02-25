-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('LESSON_LEARNED', 'MODEL_DISTRICT', 'MODEL_PERSON', 'OTHER') NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `coverImage` VARCHAR(191) NULL,
    `province` VARCHAR(191) NOT NULL,
    `amphoe` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
