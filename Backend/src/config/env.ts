import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, { error: 'DATABASE_URL es obligatoria' }),

  JWT_SECRET: z.string().min(32, { error: 'JWT_SECRET debe tener al menos 32 caracteres' }),
  // formato aceptado por jsonwebtoken: segundos ("3600") o con unidad ("15m", "12h", "1d")
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]?$/, { error: 'JWT_EXPIRES_IN debe tener un formato como 15m, 12h o 1d' })
    .default('1d'),

  // lista separada por comas de orígenes permitidos por CORS
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
});

const parsed = envSchema.safeParse(process.env);

// Fail-fast: si la configuración es inválida el servidor no debe arrancar
if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
