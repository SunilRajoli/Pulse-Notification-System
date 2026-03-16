import { Notification } from '../models/db.js';
import { getNotifications, invalidateCache } from '../services/cacheService.js';

export async function getNotificationsHandler(req, res, next) {
  try {
    const notifications = await getNotifications(req.user.id);
    return res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(req, res, next) {
  try {
    await Notification.update(
      { is_read: true },
      { where: { recipient_id: req.user.id } }
    );
    await invalidateCache(`notifs:${req.user.id}`);
    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
}
