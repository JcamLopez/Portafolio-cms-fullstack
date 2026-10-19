/*
  Warnings:

  - You are about to alter the column `fullName` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(120)`.
  - You are about to alter the column `headline` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(160)`.
  - Added the required column `updatedAt` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` ADD COLUMN `availableForWork` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `avatarUrl` VARCHAR(500) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(120) NULL,
    ADD COLUMN `phone` VARCHAR(30) NULL,
    ADD COLUMN `resumeUrl` VARCHAR(500) NULL,
    ADD COLUMN `subheadline` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `fullName` VARCHAR(120) NOT NULL,
    MODIFY `headline` VARCHAR(160) NOT NULL,
    MODIFY `bio` TEXT NULL;

-- CreateTable
CREATE TABLE `SocialLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `platform` ENUM('GITHUB', 'LINKEDIN', 'X', 'YOUTUBE', 'INSTAGRAM', 'WEBSITE', 'EMAIL', 'OTHER') NOT NULL,
    `label` VARCHAR(60) NULL,
    `url` VARCHAR(500) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `profileId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SocialLink_profileId_idx`(`profileId`),
    UNIQUE INDEX `SocialLink_profileId_platform_url_key`(`profileId`, `platform`, `url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `summary` VARCHAR(300) NULL,
    `description` TEXT NOT NULL,
    `coverImageUrl` VARCHAR(500) NULL,
    `repoUrl` VARCHAR(500) NULL,
    `demoUrl` VARCHAR(500) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_slug_key`(`slug`),
    INDEX `Project_isPublished_order_idx`(`isPublished`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `altText` VARCHAR(200) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `projectId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectImage_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,
    `slug` VARCHAR(90) NOT NULL,
    `category` ENUM('LANGUAGE', 'FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'CLOUD', 'TESTING', 'IOT', 'TOOL', 'OTHER') NOT NULL,
    `level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NULL,
    `iconUrl` VARCHAR(500) NULL,
    `color` VARCHAR(9) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Skill_name_key`(`name`),
    UNIQUE INDEX `Skill_slug_key`(`slug`),
    INDEX `Skill_category_order_idx`(`category`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(150) NOT NULL,
    `organization` VARCHAR(150) NOT NULL,
    `type` ENUM('JOB', 'TEACHING', 'FREELANCE', 'INTERNSHIP', 'VOLUNTEER') NOT NULL,
    `modality` ENUM('ONSITE', 'REMOTE', 'HYBRID') NULL,
    `location` VARCHAR(120) NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NOT NULL,
    `highlights` JSON NULL,
    `companyUrl` VARCHAR(500) NULL,
    `logoUrl` VARCHAR(500) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Experience_startDate_idx`(`startDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `institution` VARCHAR(150) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `fieldOfStudy` VARCHAR(150) NULL,
    `type` ENUM('UNDERGRADUATE', 'MASTER', 'BOOTCAMP', 'COURSE', 'CERTIFICATION') NOT NULL,
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `credentialUrl` VARCHAR(500) NULL,
    `logoUrl` VARCHAR(500) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Education_type_endDate_idx`(`type`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(200) NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('UNREAD', 'READ', 'REPLIED', 'ARCHIVED', 'SPAM') NOT NULL DEFAULT 'UNREAD',
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Message_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `Message_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectToSkill` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProjectToSkill_AB_unique`(`A`, `B`),
    INDEX `_ProjectToSkill_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ExperienceToSkill` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ExperienceToSkill_AB_unique`(`A`, `B`),
    INDEX `_ExperienceToSkill_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SocialLink` ADD CONSTRAINT `SocialLink_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectImage` ADD CONSTRAINT `ProjectImage_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToSkill` ADD CONSTRAINT `_ProjectToSkill_A_fkey` FOREIGN KEY (`A`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToSkill` ADD CONSTRAINT `_ProjectToSkill_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExperienceToSkill` ADD CONSTRAINT `_ExperienceToSkill_A_fkey` FOREIGN KEY (`A`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExperienceToSkill` ADD CONSTRAINT `_ExperienceToSkill_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
