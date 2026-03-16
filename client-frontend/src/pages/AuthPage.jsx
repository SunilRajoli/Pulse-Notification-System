import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        const data = await api.auth.login({ email, password });
        login(data.user, data.token);
        navigate('/', { replace: true });
      } else {
        await api.auth.register({ username, email, password });
        const data = await api.auth.login({ email, password });
        login(data.user, data.token);
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  return (
    <div className={`${styles.root} page`}>
      <div className={styles.card}>
        <div className={styles.title}>
          <div className={styles.logo}>Pulse</div>
          <div className={styles.subtitle}>
            Minimal feed for your notifications.
          </div>
        </div>
        <div className={styles.tabs}>
          <button
            type="button"
            className={isLogin ? styles.tabActive : styles.tab}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? styles.tabActive : styles.tab}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.field}>
              <div className={styles.label}>Username</div>
              <input
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-handle"
              />
            </div>
          )}
          <div className={styles.field}>
            <div className={styles.label}>Email</div>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>Password</div>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting
              ? isLogin
                ? 'Signing in…'
                : 'Creating account…'
              : isLogin
              ? 'Sign in'
              : 'Create account'}
          </button>
        </form>
        <div className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            className={styles.toggleLink}
            onClick={() => switchMode(isLogin ? 'register' : 'login')}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

