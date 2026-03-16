import jwt from 'jsonwebtoken';
import { Post, User, sequelize } from '../models/db.js';

export async function createPost(req, res, next) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const post = await Post.create({ user_id: req.user.id, content });
    return res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function getPosts(req, res, next) {
  try {
    let currentUserId = null;
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.id;
      } catch {
        currentUserId = null;
      }
    }

    let rows;
    if (currentUserId) {
      [rows] = await sequelize.query(
        `SELECT p.id,
                p.user_id,
                p.content,
                p.created_at,
                u.username,
                COALESCE(COUNT(l.id), 0) AS like_count,
                MAX(CASE WHEN l.liker_id = :userId THEN 1 ELSE 0 END) AS liked_by_me
         FROM posts p
         JOIN users u ON u.id = p.user_id
         LEFT JOIN likes l ON l.post_id = p.id
         GROUP BY p.id, u.username
         ORDER BY p.created_at DESC
         LIMIT 20`,
        { replacements: { userId: currentUserId } }
      );
    } else {
      [rows] = await sequelize.query(
        `SELECT p.id,
                p.user_id,
                p.content,
                p.created_at,
                u.username,
                COALESCE(COUNT(l.id), 0) AS like_count,
                0 AS liked_by_me
         FROM posts p
         JOIN users u ON u.id = p.user_id
         LEFT JOIN likes l ON l.post_id = p.id
         GROUP BY p.id, u.username
         ORDER BY p.created_at DESC
         LIMIT 20`
      );
    }
    const posts = rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      content: r.content,
      created_at: r.created_at,
      username: r.username,
      like_count: Number(r.like_count) || 0,
      liked_by_me: Boolean(r.liked_by_me),
    }));
    return res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
}
