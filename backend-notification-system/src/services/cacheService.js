import { redisClient } from '../../config/redis.js';
import { Notification } from '../models/db.js';

export async function getNotifications(userId) {
  const key = `notifs:${userId}`;
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached);

  const result = await Notification.findAll({
    where: { recipient_id: userId },
    order: [['updated_at', 'DESC']],
    limit: 20,
  });
  const rows = result.map((n) => n.toJSON());
  await redisClient.setex(key, 60, JSON.stringify(rows));
  return rows;
}

export async function invalidateCache(key) {
  await redisClient.del(key);
}
