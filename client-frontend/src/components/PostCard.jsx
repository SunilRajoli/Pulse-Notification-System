import { Heart } from 'lucide-react';
import styles from './PostCard.module.css';

function formatDate(value) {
  const d = new Date(value);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post, onLikeToggle }) {
  const handleClick = () => {
    onLikeToggle(post.id, post.liked);
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.user}>@{post.username}</span>
        <span className={styles.timestamp}>{formatDate(post.created_at)}</span>
      </header>
      <div className={styles.content}>{post.content}</div>
      <footer className={styles.footer}>
        <button
          type="button"
          onClick={handleClick}
          className={
            post.liked
              ? `${styles.likeButton} ${styles.likeButtonActive}`
              : styles.likeButton
          }
        >
          <Heart size={18} />
        </button>
        <span
          className={
            post.liked
              ? `${styles.likeCount} ${styles.likeCountActive}`
              : styles.likeCount
          }
        >
          {post.like_count ?? 0} likes
        </span>
      </footer>
    </article>
  );
}

