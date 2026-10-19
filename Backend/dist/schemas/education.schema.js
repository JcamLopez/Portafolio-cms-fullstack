import { z } from 'zod';
import { EducationType } from '@prisma/client';
// devuelve un mensaje distinto según si el campo falta o tiene un tipo incorrecto
const requiredText = (field) => z
    .string({
    error: (issue) => issue.input === undefined ? `El campo ${field} es obligatorio` : `El campo ${field} debe ser texto`,
})
    .min(1, { error: `El campo ${field} es obligatorio` });
const optionalText = (field, max) => {
    const base = z.string({ error: `El campo ${field} debe ser texto` });
    return (max ? base.max(max, { error: `El campo ${field} no puede superar los ${max} caracteres` }) : base)
        .nullable()
        .optional();
};
const optionalUrl = (field) => z
    .url({ protocol: /^https?$/, error: `El campo ${field} debe ser una URL válida (http o https)` })
    .max(500, { error: `El campo ${field} no puede superar los 500 caracteres` })
    .nullable()
    .optional();
// acepta fechas ISO ("2024-03-01") u objetos Date
const optionalDate = (field) => z.coerce
    .date({ error: `El campo ${field} debe ser una fecha válida (ej. 2024-03-01)` })
    .nullable()
    .optional();
export const educationSchema = z
    .object({
    institution: requiredText('institution').max(150, {
        error: 'La institución no puede superar los 150 caracteres',
    }),
    title: requiredText('title').max(150, { error: 'El título no puede superar los 150 caracteres' }),
    type: z.enum(EducationType, {
        error: `El campo type debe ser uno de: ${Object.values(EducationType).join(', ')}`,
    }),
    startDate: optionalDate('startDate'),
    endDate: optionalDate('endDate'),
    isCurrent: z.boolean({ error: 'El campo isCurrent debe ser verdadero o falso' }).optional(),
    description: optionalText('description'),
    fieldOfStudy: optionalText('fieldOfStudy', 150),
    credentialUrl: optionalUrl('credentialUrl'),
    logoUrl: optionalUrl('logoUrl'),
    order: z
        .number({ error: 'El campo order debe ser un número' })
        .int({ error: 'El campo order debe ser un número entero' })
        .optional(),
})
    .refine((data) => !(data.isCurrent && data.endDate), {
    path: ['endDate'],
    error: 'Una formación en curso (isCurrent) no puede tener fecha de fin',
})
    .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    path: ['endDate'],
    error: 'La fecha de fin no puede ser anterior a la fecha de inicio',
});
//# sourceMappingURL=education.schema.js.map