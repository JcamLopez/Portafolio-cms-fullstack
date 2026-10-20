import { Router } from 'express';
import {
  createEducation,
  deleteEducation,
  getAllEducations,
  getEducationById,
  reorderEducations,
  setEducationFeatured,
  updateEducation,
} from '../controllers/education.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { featuredSchema, reorderSchema } from '../schemas/common.schema.js';
import { educationSchema } from '../schemas/education.schema.js';

const router = Router();

router.get('/', getAllEducations);
router.get('/:id', getEducationById);
router.post('/', requireAuth, validateSchema(educationSchema), createEducation);
// va antes de /:id para que "reorder" no se interprete como un id
router.put('/reorder', requireAuth, validateSchema(reorderSchema), reorderEducations);
router.put('/:id', requireAuth, validateSchema(educationSchema), updateEducation);
router.patch('/:id/featured', requireAuth, validateSchema(featuredSchema), setEducationFeatured);
router.delete('/:id', requireAuth, deleteEducation);

export default router;
