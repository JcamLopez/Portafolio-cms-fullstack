import { z } from 'zod';
import { SkillCategory, SkillLevel } from '@prisma/client';

// devuelve un mensaje distinto según si el campo falta o tiene un tipo incorrecto
const requiredText = (field: string) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined ? `El campo ${field} es obligatorio` : `El campo ${field} debe ser texto`,
    })
    .min(1, { error: `El campo ${field} es obligatorio` });

// los valores salen de los enums de Prisma para que Zod y la BD nunca se desincronicen
const categoryValues = Object.values(SkillCategory).join(', ');
const levelValues = Object.values(SkillLevel).join(', ');

export const skillSchema = z.object({
  name: requiredText('name').max(80, { error: 'El nombre no puede superar los 80 caracteres' }),
  slug: requiredText('slug')
    .max(90, { error: 'El slug no puede superar los 90 caracteres' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: 'El slug solo puede contener minúsculas, números y guiones (ej. node-js)',
    }),
  category: z.enum(SkillCategory, {
    error: (issue) =>
      issue.input === undefined
        ? 'El campo category es obligatorio'
        : `El campo category debe ser uno de: ${categoryValues}`,
  }),
  level: z
    .enum(SkillLevel, { error: `El campo level debe ser uno de: ${levelValues}` })
    .nullable()
    .optional(),
  iconUrl: z
    .url({ protocol: /^https?$/, error: 'El campo iconUrl debe ser una URL válida (http o https)' })
    .max(500, { error: 'El campo iconUrl no puede superar los 500 caracteres' })
    .nullable()
    .optional(),
  color: z
    .string({ error: 'El campo color debe ser texto' })
    .regex(/^#[0-9A-Fa-f]{6}$/, { error: 'Debe ser un color Hex válido, ej. #3178C6' })
    .nullable()
    .optional(),
  isFeatured: z.boolean({ error: 'El campo isFeatured debe ser verdadero o falso' }).optional(),
  order: z
    .number({ error: 'El campo order debe ser un número' })
    .int({ error: 'El campo order debe ser un número entero' })
    .optional(),
});

export type SkillSchemaInput = z.infer<typeof skillSchema>;
