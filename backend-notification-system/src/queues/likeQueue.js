import { Queue } from 'bullmq';
import { redisConnection } from '../../config/redis.js';

export const likeQueue = new Queue('likes', { connection: redisConnection });

export function enqueueLikeNotification(likerId, postId, ownerId) {
  likeQueue.add('notify', { likerId, postId, ownerId });
}
