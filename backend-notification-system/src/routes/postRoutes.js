import { Router } from 'express';
import { getPosts, createPost } from '../controllers/postController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/posts', getPosts);
router.post('/posts', auth, createPost);

export default router;
