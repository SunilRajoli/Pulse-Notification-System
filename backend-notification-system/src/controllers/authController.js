import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/db.js';

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username) return res.status(400).json({ error: 'username is required' });
    if (!email) return res.status(400).json({ error: 'email is required' });
    if (!password) return res.status(400).json({ error: 'password is required' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password_hash });
    return res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });
    if (!password) return res.status(400).json({ error: 'password is required' });

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(200).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}
