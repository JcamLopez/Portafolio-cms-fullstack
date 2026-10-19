import { registerSchema } from '../schemas/auth.schema.js';
import { EmailAlreadyExistsError, registerUser } from '../services/auth.service.js';
// Crea el primer usuario ADMIN (bootstrap), ya que /api/auth/register exige estar autenticado.
// Uso: npm run auth:create-admin -- <email> <password> [nombre]
const [email, password, name] = process.argv.slice(2);
const parsed = registerSchema.safeParse({ email, password, name });
if (!parsed.success) {
    console.error('Uso: npm run auth:create-admin -- <email> <password> [nombre]');
    for (const issue of parsed.error.issues)
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    process.exit(1);
}
try {
    const user = await registerUser(parsed.data);
    console.log(`✅ Usuario ${user.role} creado: ${user.email} (id: ${user.id})`);
    process.exit(0);
}
catch (error) {
    console.error(error instanceof EmailAlreadyExistsError ? `❌ ${error.message}` : error);
    process.exit(1);
}
//# sourceMappingURL=create-admin.js.map