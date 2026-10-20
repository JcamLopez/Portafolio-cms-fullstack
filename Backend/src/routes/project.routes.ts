import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  reorderProjects,
  setProjectFeatured,
  updateProject,
} from '../controllers/project.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { featuredSchema, reorderSchema } from '../schemas/common.schema.js';
import { projectSchema } from '../schemas/project.schema.js';

const router = Router();

router.get('/', getAllProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', getProjectById);
router.post('/', requireAuth, validateSchema(projectSchema), createProject);
// va antes de /:id para que "reorder" no se interprete como un id
router.put('/reorder', requireAuth, validateSchema(reorderSchema), reorderProjects);
router.put('/:id', requireAuth, validateSchema(projectSchema), updateProject);
router.patch('/:id/featured', requireAuth, validateSchema(featuredSchema), setProjectFeatured);
router.delete('/:id', requireAuth, deleteProject);

export default router;
