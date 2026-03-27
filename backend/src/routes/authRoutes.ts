import express from 'express';
import { login, changePassword } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);
// Protected route for changing password (especially on first login)
router.post('/change-password', authenticate, changePassword);

export default router;
