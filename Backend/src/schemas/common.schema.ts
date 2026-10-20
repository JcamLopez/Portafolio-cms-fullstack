import { z } from 'zod';

// Orden manual (drag & drop): lista de ids en la nueva posición; el índice pasa a ser el `order`
export const reorderSchema = z.object({
  ids: z
    .array(
      z
        .number({ error: 'Cada id de ids debe ser un número' })
        .int({ error: 'Cada id de ids debe ser un número entero' })
        .positive({ error: 'Cada id de ids debe ser positivo' }),
      { error: 'El campo ids debe ser una lista de ids' },
    )
    .min(1, { error: 'El campo ids no puede estar vacío' })
    .refine((ids) => new Set(ids).size === ids.length, { error: 'El campo ids no puede tener ids repetidos' }),
});

export const featuredSchema = z.object({
  isFeatured: z.boolean({ error: 'El campo isFeatured debe ser verdadero o falso' }),
});

export type ReorderInput = z.infer<typeof reorderSchema>;
export type FeaturedInput = z.infer<typeof featuredSchema>;
