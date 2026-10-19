import { Router } from 'express';
import {
  createEducation,
  deleteEducation,
  getAllEducations,
  getEducationById,
  updateEducation,
} from '../controllers/education.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { educationSchema } from '../schemas/education.schema.js';

const router = Router();

router.get('/', getAllEducations);
router.get('/:id', getEducationById);
router.post('/', requireAuth, validateSchema(educationSchema), createEducation);
router.put('/:id', requireAuth, validateSchema(educationSchema), updateEducation);
router.delete('/:id', requireAuth, deleteEducation);

export default router;
