import { Router } from 'express';
import { createExperience, deleteExperience, getAllExperiences, getExperienceById, updateExperience, } from '../controllers/experience.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { experienceSchema } from '../schemas/experience.schema.js';
const router = Router();
router.get('/', getAllExperiences);
router.get('/:id', getExperienceById);
router.post('/', requireAuth, validateSchema(experienceSchema), createExperience);
router.put('/:id', requireAuth, validateSchema(experienceSchema), updateExperience);
router.delete('/:id', requireAuth, deleteExperience);
export default router;
//# sourceMappingURL=experience.routes.js.map