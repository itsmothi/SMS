import express from 'express';
import { getMyProfile, getMyAttendance, getMyMarks } from '../controllers/studentController';
import { authenticate, authorizeRole } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate, authorizeRole('STUDENT'));

router.get('/profile', getMyProfile);
router.get('/attendance', getMyAttendance);
router.get('/marks', getMyMarks);

export default router;
