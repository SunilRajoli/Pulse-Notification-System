import { Post, Like } from '../models/db.js';
import { enqueueLikeNotification } from '../queues/likeQueue.js';

export async function likePost(req, res, next) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'Resource not found' });

    const existing = await Like.findOne({ where: { post_id: postId, liker_id: userId } });
    if (existing) return res.status(409).json({ error: 'Already liked' });

    await Like.create({ post_id: postId, liker_id: userId });

    enqueueLikeNotification(userId, postId, post.user_id);

    return res.status(201).json({ message: 'Post liked' });
  } catch (err) {
    next(err);
  }
}

export async function unlikePost(req, res, next) {
  try {
    const { postId } = req.params;
    await Like.destroy({ where: { post_id: postId, liker_id: req.user.id } });
    return res.status(200).json({ message: 'Post unliked' });
  } catch (err) {
    next(err);
  }
}
