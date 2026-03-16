import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../api/api.js';
import styles from './CreatePostModal.module.css';

export default function CreatePostModal({ onClose, onCreated }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('content is required');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const created = await api.posts.create({ content });
      onCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Post</h2>
          <button type="button" className={styles.close} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder="What&apos;s on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

