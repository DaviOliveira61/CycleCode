import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', categoryController.getAllCategories);

router.post('/', authMiddleware, adminOnly, categoryController.createCategory);
router.patch('/:id', authMiddleware, adminOnly, categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminOnly, categoryController.deleteCategory);

export default router;
