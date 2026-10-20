import { Router } from 'express';
import {
  createExperience,
  deleteExperience,
  getAllExperiences,
  getExperienceById,
  reorderExperiences,
  setExperienceFeatured,
  updateExperience,
} from '../controllers/experience.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { featuredSchema, reorderSchema } from '../schemas/common.schema.js';
import { experienceSchema } from '../schemas/experience.schema.js';

const router = Router();

router.get('/', getAllExperiences);
router.get('/:id', getExperienceById);
router.post('/', requireAuth, validateSchema(experienceSchema), createExperience);
// va antes de /:id para que "reorder" no se interprete como un id
router.put('/reorder', requireAuth, validateSchema(reorderSchema), reorderExperiences);
router.put('/:id', requireAuth, validateSchema(experienceSchema), updateExperience);
router.patch('/:id/featured', requireAuth, validateSchema(featuredSchema), setExperienceFeatured);
router.delete('/:id', requireAuth, deleteExperience);

export default router;
