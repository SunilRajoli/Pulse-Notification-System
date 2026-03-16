import { useEffect, useState } from 'react';
import { api } from '../api/api.js';
import PostCard from '../components/PostCard.jsx';
import CreatePostModal from '../components/CreatePostModal.jsx';
import styles from './FeedPage.module.css';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.posts.list();
        if (!mounted) return;
        const withLocalState = (data.posts || []).map((p) => ({
          ...p,
          liked: Boolean(p.liked_by_me),
          like_count: p.like_count ?? 0,
        }));
        setPosts(withLocalState);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load posts');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLikeToggle = async (postId, currentlyLiked) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
            ...p,
            liked: !currentlyLiked,
            like_count: (p.like_count || 0) + (currentlyLiked ? -1 : 1),
          }
          : p
      )
    );
    try {
      if (!currentlyLiked) {
        await api.likes.like(postId);
      } else {
        await api.likes.unlike(postId);
      }
    } catch {
      // roll back if needed
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
              ...p,
              liked: currentlyLiked,
              like_count: (p.like_count || 0) + (currentlyLiked ? 1 : -1),
            }
            : p
        )
      );
    }
  };

  const handleCreated = (post) => {
    setPosts((prev) => [
      {
        ...post,
        liked: false,
        like_count: 0,
      },
      ...prev,
    ]);
  };

  return (
    <div className={`${styles.root} page`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Feed</h1>
        <button
          type="button"
          className={styles.newPost}
          onClick={() => setShowModal(true)}
        >
          New Post
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {loading && !error && <div className={styles.empty}>Loading…</div>}
      {!loading && posts.length === 0 && !error && (
        <div className={styles.empty}>Nothing here yet. Start by posting.</div>
      )}
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onLikeToggle={handleLikeToggle} />
      ))}
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

