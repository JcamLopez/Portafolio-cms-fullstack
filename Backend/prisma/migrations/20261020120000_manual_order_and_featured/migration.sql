-- AlterTable
ALTER TABLE `Education` ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Experience` ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false;

-- Normaliza `order` (0..n-1) respetando el orden que se mostraba hasta ahora
UPDATE `Education` e
JOIN (SELECT `id`, ROW_NUMBER() OVER (ORDER BY `startDate` DESC, `order` ASC, `id` ASC) - 1 AS `pos` FROM `Education`) r
  ON r.`id` = e.`id`
SET e.`order` = r.`pos`;

UPDATE `Experience` e
JOIN (SELECT `id`, ROW_NUMBER() OVER (ORDER BY `startDate` DESC, `order` ASC, `id` ASC) - 1 AS `pos` FROM `Experience`) r
  ON r.`id` = e.`id`
SET e.`order` = r.`pos`;

UPDATE `Project` p
JOIN (SELECT `id`, ROW_NUMBER() OVER (ORDER BY `order` ASC, `createdAt` DESC, `id` ASC) - 1 AS `pos` FROM `Project`) r
  ON r.`id` = p.`id`
SET p.`order` = r.`pos`;

UPDATE `Skill` s
JOIN (SELECT `id`, ROW_NUMBER() OVER (ORDER BY `category` ASC, `order` ASC, `name` ASC) - 1 AS `pos` FROM `Skill`) r
  ON r.`id` = s.`id`
SET s.`order` = r.`pos`;