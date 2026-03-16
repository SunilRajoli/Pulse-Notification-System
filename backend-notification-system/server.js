import 'dotenv/config';
import express from 'express';
import { sequelize } from './src/models/db.js';
import authRoutes from './src/routes/authRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import likeRoutes from './src/routes/likeRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';

// Trigger DB connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);
app.use('/api', likeRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
