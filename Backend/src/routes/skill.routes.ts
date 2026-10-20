import { Router } from 'express';
import {
  createSkill,
  deleteSkill,
  getAllSkills,
  getSkillById,
  getSkillBySlug,
  reorderSkills,
  setSkillFeatured,
  updateSkill,
} from '../controllers/skill.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { featuredSchema, reorderSchema } from '../schemas/common.schema.js';
import { skillSchema } from '../schemas/skill.schema.js';

const router = Router();

router.get('/', getAllSkills);
// va antes de /:id para que "slug" no se interprete como un id
router.get('/slug/:slug', getSkillBySlug);
router.get('/:id', getSkillById);
router.post('/', requireAuth, validateSchema(skillSchema), createSkill);
// va antes de /:id para que "reorder" no se interprete como un id
router.put('/reorder', requireAuth, validateSchema(reorderSchema), reorderSkills);
router.put('/:id', requireAuth, validateSchema(skillSchema), updateSkill);
router.patch('/:id/featured', requireAuth, validateSchema(featuredSchema), setSkillFeatured);
router.delete('/:id', requireAuth, deleteSkill);

export default router;
