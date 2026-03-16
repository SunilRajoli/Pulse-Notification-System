import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext.jsx';
import NotificationItem from '../components/NotificationItem.jsx';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
  const { notifications, unreadCount, fetchNotifications, markAllRead } =
    useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className={`${styles.root} page`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        {unreadCount > 0 && (
          <button
            type="button"
            className={styles.markAll}
            onClick={markAllRead}
          >
            Mark all read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className={styles.empty}>No notifications yet.</div>
      ) : (
        notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))
      )}
    </div>
  );
}

