-- CreateTable
CREATE TABLE `Leave_balances` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `fiscal_year_start` DATETIME(3) NOT NULL,
    `fiscal_year_end` DATETIME(3) NOT NULL,
    `totol_days` INTEGER NOT NULL DEFAULT 10,
    `used_days` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Leave_balances_employeeId_fiscal_year_start_key`(`employeeId`, `fiscal_year_start`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Leave_balances` ADD CONSTRAINT `Leave_balances_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
