import { z } from 'zod';
// devuelve un mensaje distinto según si el campo falta o tiene un tipo incorrecto
const requiredText = (field) => z
    .string({
    error: (issue) => issue.input === undefined ? `El campo ${field} es obligatorio` : `El campo ${field} debe ser texto`,
})
    .min(1, { error: `El campo ${field} es obligatorio` });
const optionalUrl = (field) => z
    .url({ protocol: /^https?$/, error: `El campo ${field} debe ser una URL válida (http o https)` })
    .max(500, { error: `El campo ${field} no puede superar los 500 caracteres` })
    .nullable()
    .optional();
const optionalBoolean = (field) => z.boolean({ error: `El campo ${field} debe ser verdadero o falso` }).optional();
export const projectSchema = z.object({
    title: requiredText('title').max(150, { error: 'El título no puede superar los 150 caracteres' }),
    slug: requiredText('slug')
        .max(160, { error: 'El slug no puede superar los 160 caracteres' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        error: 'El slug solo puede contener minúsculas, números y guiones (ej. mi-proyecto)',
    }),
    summary: z
        .string({ error: 'El campo summary debe ser texto' })
        .max(300, { error: 'El resumen no puede superar los 300 caracteres' })
        .nullable()
        .optional(),
    description: requiredText('description'),
    coverImageUrl: optionalUrl('coverImageUrl'),
    repoUrl: optionalUrl('repoUrl'),
    demoUrl: optionalUrl('demoUrl'),
    isPublished: optionalBoolean('isPublished'),
    isFeatured: optionalBoolean('isFeatured'),
    order: z
        .number({ error: 'El campo order debe ser un número' })
        .int({ error: 'El campo order debe ser un número entero' })
        .optional(),
});
//# sourceMappingURL=project.schema.js.map