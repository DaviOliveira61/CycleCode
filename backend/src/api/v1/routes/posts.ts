import { Router } from 'express';
import * as postController from '../controllers/postController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', postController.getPosts);
router.get('/:slug', postController.getPost);

router.post('/', authMiddleware, adminOnly, postController.createPost);
router.patch('/:id', authMiddleware, adminOnly, postController.updatePost);
router.delete('/:id', authMiddleware, adminOnly, postController.deletePost);

router.post('/:id/translations', authMiddleware, adminOnly, postController.addTranslation);

export default router;

