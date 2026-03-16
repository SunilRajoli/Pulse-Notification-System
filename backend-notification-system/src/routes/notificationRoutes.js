import { Router } from 'express';
import { getNotificationsHandler, markAllRead } from '../controllers/notificationController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/', auth, getNotificationsHandler);
router.put('/read-all', auth, markAllRead);

export default router;
