import { Router } from 'express';
import * as postController from '../controllers/postController.ts';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', postController.getPosts);

router.get('/:slug', postController.getPost);
router.post('/', authMiddleware, postController.createPost);

/*
// Rotas para o futuro (UPDATE e DELETE)
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
*/

export default router;