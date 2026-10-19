import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from '../controllers/project.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { projectSchema } from '../schemas/project.schema.js';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', requireAuth, validateSchema(projectSchema), createProject);
router.put('/:id', requireAuth, validateSchema(projectSchema), updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
