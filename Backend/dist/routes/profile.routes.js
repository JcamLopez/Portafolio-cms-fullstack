import { Router } from 'express';
import { getProfile, upsertProfile } from '../controllers/profile.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { profileSchema } from '../schemas/profile.schema.js';
const router = Router();
router.get('/', getProfile);
router.put('/', requireAuth, validateSchema(profileSchema), upsertProfile);
export default router;
//# sourceMappingURL=profile.routes.js.map