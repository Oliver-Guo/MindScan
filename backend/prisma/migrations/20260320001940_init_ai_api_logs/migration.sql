-- CreateTable
CREATE TABLE `ai_api_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_type` VARCHAR(50) NOT NULL,
    `model_type` VARCHAR(100) NOT NULL,
    `status` INTEGER NOT NULL,
    `request` JSON NOT NULL,
    `response` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
