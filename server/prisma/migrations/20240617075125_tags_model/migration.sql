/*
  Warnings:

  - You are about to drop the column `work_date` on the `workschedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `workschedule` DROP COLUMN `work_date`,
    ADD COLUMN `work_end` DATETIME(3) NULL,
    ADD COLUMN `work_start` DATETIME(3) NULL;
