import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = new Redis(redisUrl);

// Parse URL for BullMQ (requires plain { host, port } object, not ioredis instance)
const url = new URL(redisUrl);
export const redisConnection = {
  host: url.hostname,
  port: parseInt(url.port || '6379', 10),
};

export { redisClient };
