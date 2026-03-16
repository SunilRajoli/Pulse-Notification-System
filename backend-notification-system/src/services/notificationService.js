import { sequelize } from '../models/db.js';

export async function upsertLikeNotification({ likerId, postId, ownerId }) {
  const payload = JSON.stringify({ post_id: postId, last_actor_id: likerId });
  await sequelize.query(
    `INSERT INTO notifications (id, recipient_id, type, payload, agg_count, updated_at)
     VALUES (gen_random_uuid(), $1, 'like', $2::jsonb, 1, NOW())
     ON CONFLICT (recipient_id, type, (payload->>'post_id'))
     DO UPDATE SET
       agg_count  = (
         SELECT COUNT(*) FROM likes WHERE post_id = $3
       ),
       payload    = notifications.payload || $2::jsonb,
       updated_at = NOW(),
       is_read    = false`,
    {
      bind: [ownerId, payload, postId],
    }
  );
}
