-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `idCard` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `resetToken` VARCHAR(191) NOT NULL DEFAULT '',
    `refreshToken` VARCHAR(191) NOT NULL DEFAULT '',
    `roleId` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_idCard_key`(`idCard`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `salary` INTEGER NOT NULL DEFAULT 0,
    `saving` INTEGER NOT NULL DEFAULT 0,
    `transcript` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `idCard` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `date_of_birth` DATETIME(3) NULL,
    `address` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `job_title` VARCHAR(191) NULL,
    `education_level` VARCHAR(191) NULL,
    `experience` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_idCard_key`(`idCard`),
    UNIQUE INDEX `Employee_phone_number_key`(`phone_number`),
    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employment_Details` (
    `id` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `contract_type` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `pro_pass` DATETIME(3) NULL,
    `salary` INTEGER NULL,
    `salary_increase` VARCHAR(191) NULL,
    `salary_decrease` VARCHAR(191) NULL,
    `tax_information` VARCHAR(191) NULL,
    `work_per_day` DECIMAL(65, 30) NULL,
    `allocated_leave_days` LONGBLOB NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Employment_Details_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `work_date` DATETIME(3) NULL,
    `work_status` VARCHAR(191) NULL,
    `employeeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leave` (
    `id` VARCHAR(191) NOT NULL,
    `leave_type` VARCHAR(191) NULL,
    `leave_date` DATETIME(3) NULL,
    `leave_reason` VARCHAR(191) NULL,
    `employeeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` VARCHAR(191) NOT NULL,
    `expense_date` DATETIME(3) NULL,
    `expense_description` VARCHAR(191) NULL,
    `expense_amount` DECIMAL(65, 30) NULL,
    `employment_DetailsId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Performance` (
    `id` VARCHAR(191) NOT NULL,
    `performance_rating` VARCHAR(191) NULL,
    `feedback` VARCHAR(191) NULL,
    `employeeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Performance_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Financial_Details` (
    `id` VARCHAR(191) NOT NULL,
    `bank_account_number` VARCHAR(191) NULL,
    `bank_name` VARCHAR(191) NULL,
    `social_security_number` VARCHAR(191) NULL,
    `health_insurance` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Financial_Details_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `System_Access` (
    `access_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191) NULL,
    `access_rights` VARCHAR(191) NULL,
    `roleId` INTEGER NOT NULL DEFAULT 1,
    `employeeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `System_Access_employeeId_key`(`employeeId`),
    PRIMARY KEY (`access_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employment_Details` ADD CONSTRAINT `Employment_Details_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkSchedule` ADD CONSTRAINT `WorkSchedule_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_employment_DetailsId_fkey` FOREIGN KEY (`employment_DetailsId`) REFERENCES `Employment_Details`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Performance` ADD CONSTRAINT `Performance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Financial_Details` ADD CONSTRAINT `Financial_Details_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `System_Access` ADD CONSTRAINT `System_Access_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `System_Access` ADD CONSTRAINT `System_Access_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
