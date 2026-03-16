import { Worker } from 'bullmq';
import { redisConnection } from '../../config/redis.js';
import { upsertLikeNotification } from '../services/notificationService.js';
import { invalidateCache } from '../services/cacheService.js';

const worker = new Worker(
  'likes',
  async (job) => {
    const { likerId, postId, ownerId } = job.data;
    await upsertLikeNotification({ likerId, postId, ownerId });
    await invalidateCache(`notifs:${ownerId}`);
    console.log(`Processed like job ${job.id}`);
  },
  { connection: redisConnection }
);

console.log('Like worker is running and waiting for jobs...');

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});
