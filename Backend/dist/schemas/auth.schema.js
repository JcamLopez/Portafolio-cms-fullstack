import { z } from 'zod';
const emailField = z
    .email({ error: 'El campo email debe ser un correo válido' })
    .max(191, { error: 'El campo email no puede superar los 191 caracteres' })
    // se guarda y compara siempre en minúsculas para que "Admin@x.com" y "admin@x.com" sean el mismo usuario
    .transform((email) => email.trim().toLowerCase());
export const registerSchema = z.object({
    email: emailField,
    password: z
        .string({ error: 'El campo password es obligatorio' })
        .min(6, { error: 'El password debe tener al menos 6 caracteres' })
        // bcrypt ignora todo lo que pase de 72 bytes: se rechaza en vez de truncarlo en silencio
        .max(72, { error: 'El password no puede superar los 72 caracteres' }),
    name: z
        .string({ error: 'El campo name debe ser texto' })
        .trim()
        .min(1, { error: 'El campo name no puede estar vacío' })
        .max(120, { error: 'El campo name no puede superar los 120 caracteres' })
        .optional(),
});
export const loginSchema = z.object({
    email: emailField,
    password: z
        .string({ error: 'El campo password es obligatorio' })
        .min(1, { error: 'El campo password es obligatorio' })
        .max(72, { error: 'El password no puede superar los 72 caracteres' }),
});
//# sourceMappingURL=auth.schema.js.map