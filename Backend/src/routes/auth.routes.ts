import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const router = Router();

// protegido: el rol por defecto es ADMIN, así que un registro público permitiría a
// cualquiera obtener acceso de escritura. El primer admin se crea con: npm run auth:create-admin
router.post('/register', requireAuth, validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);

export default router;
