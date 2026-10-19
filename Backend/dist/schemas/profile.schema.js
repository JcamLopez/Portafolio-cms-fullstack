import { z } from 'zod';
// devuelve un mensaje distinto según si el campo falta o tiene un tipo incorrecto
const requiredText = (requiredError, invalidTypeError) => z.string({ error: (issue) => (issue.input === undefined ? requiredError : invalidTypeError) });
const optionalText = (field) => z.string({ error: `El campo ${field} debe ser texto` }).optional();
const optionalUrl = (field) => z
    .url({ protocol: /^https?$/, error: `El campo ${field} debe ser una URL válida (http o https)` })
    .nullable()
    .optional();
export const profileSchema = z.object({
    fullName: requiredText('El campo fullName es obligatorio', 'El campo fullName debe ser texto')
        .min(3, { error: 'El nombre completo debe tener al menos 3 caracteres' }),
    headline: requiredText('El titular profesional es obligatorio', 'El titular debe ser un texto')
        .min(1, { error: 'El titular profesional es obligatorio' }),
    subheadline: optionalText('subheadline').nullable(),
    bio: optionalText('bio').nullable(),
    location: optionalText('location').nullable(),
    email: z.email({ error: 'El campo email debe ser un correo válido' }).nullable().optional(),
    phone: optionalText('phone').nullable(),
    avatarUrl: optionalUrl('avatarUrl'),
    resumeUrl: optionalUrl('resumeUrl'),
    availableForWork: z.boolean({ error: 'El campo availableForWork debe ser verdadero o falso' }).optional(),
});
//# sourceMappingURL=profile.schema.js.map