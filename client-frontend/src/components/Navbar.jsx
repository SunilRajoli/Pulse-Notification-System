import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const location = useLocation();
  const { unreadCount, fetchNotifications } = useNotifications();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Pulse
        </Link>
        <div className={styles.right}>
          <Link
            to="/"
            className={
              location.pathname === '/' ? styles.navLinkActive : styles.navLink
            }
          >
            Feed
          </Link>
          <Link to="/notifications" className={styles.navLink}>
            <span className={styles.bellWrapper}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className={styles.badge}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
          </Link>
          {user && <span>@{user.username}</span>}
          <button type="button" className={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

