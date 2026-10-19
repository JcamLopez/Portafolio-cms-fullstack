import { z } from 'zod';
import { ExperienceType, WorkModality } from '@prisma/client';
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
// acepta fechas ISO ("2024-03-01") u objetos Date. Se convierte a mano en lugar de
// usar z.coerce.date() para que un campo ausente no llegue como "Invalid Date"
// y pueda reportarse como obligatorio
const dateField = (field) => z.preprocess((value) => (typeof value === 'string' || typeof value === 'number' ? new Date(value) : value), z.date({
    error: (issue) => issue.input === undefined
        ? `El campo ${field} es obligatorio`
        : `El campo ${field} debe ser una fecha válida (ej. 2024-03-01)`,
}));
export const experienceSchema = z
    .object({
    role: requiredText('role').max(150, { error: 'El cargo no puede superar los 150 caracteres' }),
    organization: requiredText('organization').max(150, {
        error: 'La organización no puede superar los 150 caracteres',
    }),
    description: requiredText('description'),
    type: z.enum(ExperienceType, {
        error: `El campo type debe ser uno de: ${Object.values(ExperienceType).join(', ')}`,
    }),
    startDate: dateField('startDate'),
    endDate: dateField('endDate').nullable().optional(),
    isCurrent: z.boolean({ error: 'El campo isCurrent debe ser verdadero o falso' }).optional(),
    modality: z
        .enum(WorkModality, {
        error: `El campo modality debe ser uno de: ${Object.values(WorkModality).join(', ')}`,
    })
        .nullable()
        .optional(),
    location: z
        .string({ error: 'El campo location debe ser texto' })
        .max(120, { error: 'La ubicación no puede superar los 120 caracteres' })
        .nullable()
        .optional(),
    companyUrl: optionalUrl('companyUrl'),
    logoUrl: optionalUrl('logoUrl'),
    highlights: z
        .array(z.string({ error: 'Cada logro de highlights debe ser texto' }), {
        error: 'El campo highlights debe ser una lista de textos',
    })
        .nullable()
        .optional(),
    order: z
        .number({ error: 'El campo order debe ser un número' })
        .int({ error: 'El campo order debe ser un número entero' })
        .optional(),
})
    .refine((data) => !(data.isCurrent && data.endDate), {
    path: ['endDate'],
    error: 'Una experiencia actual (isCurrent) no puede tener fecha de fin',
})
    .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    path: ['endDate'],
    error: 'La fecha de fin no puede ser anterior a la fecha de inicio',
});
//# sourceMappingURL=experience.schema.js.map