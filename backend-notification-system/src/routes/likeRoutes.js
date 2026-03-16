import { Router } from 'express';
import { likePost, unlikePost } from '../controllers/likeController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.post('/posts/:postId/like', auth, likePost);
router.delete('/posts/:postId/like', auth, unlikePost);

export default router;
