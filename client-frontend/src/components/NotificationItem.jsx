import { Heart } from 'lucide-react';
import styles from './NotificationItem.module.css';

function timeAgo(value) {
  const now = Date.now();
  const then = new Date(value).getTime();
  const diff = Math.max(0, Math.floor((now - then) / 1000));
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function buildMessage(notification) {
  if (notification.type === 'like') {
    const count = notification.agg_count || 1;
    if (count === 1) return 'Someone liked your post';
    if (count === 2) return '2 people liked your post';
    return `${count} people liked your post`;
  }
  return 'You have a new notification';
}

export default function NotificationItem({ notification }) {
  const unread = !notification.is_read;
  const itemClass = unread
    ? `${styles.item} ${styles.unread}`
    : `${styles.item} ${styles.read}`;
  const iconClass = unread
    ? `${styles.iconCircle} ${styles.iconUnread}`
    : `${styles.iconCircle} ${styles.iconRead}`;

  return (
    <div className={itemClass}>
      <div className={iconClass}>
        <Heart size={18} />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{buildMessage(notification)}</div>
        <div className={styles.timestamp}>{timeAgo(notification.updated_at)}</div>
      </div>
    </div>
  );
}

