-- AlterTable
ALTER TABLE `education` ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `experience` ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false;

-- Normaliza `order` (0..n-1) respetando el orden que se mostraba hasta ahora,
-- para que el orden manual (drag & drop) parta de la vista actual
UPDATE `education` e
JOIN (SELECT `id`, ROW_NUMBER() OVER (ORDER BY `startDate` DESC, `order` ASC, `id` ASC) - 1 AS `pos` FROM `education`) r
  ON r.`id` = e.`id`
SET e.`order` = r.`pos`;

UPDATE `experience` e
JOIN (SELECT `id`, ROW_NUMBER() OVER (ORDER BY `startDate` DESC, `order` ASC, `id` ASC) - 1 AS `pos` FROM `experience`) r
  ON r.`id` = e.`id`
SET e.`order` = r.`pos`;

UPDATE `project` p
JOIN (SELECT `id`, ROW_NUMBER() OVER (ORDER BY `order` ASC, `createdAt` DESC, `id` ASC) - 1 AS `pos` FROM `project`) r
  ON r.`id` = p.`id`
SET p.`order` = r.`pos`;

UPDATE `skill` s
JOIN (SELECT `id`, ROW_NUMBER() OVER (ORDER BY `category` ASC, `order` ASC, `name` ASC) - 1 AS `pos` FROM `skill`) r
  ON r.`id` = s.`id`
SET s.`order` = r.`pos`;
