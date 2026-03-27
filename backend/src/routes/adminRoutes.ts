import express from 'express';
import { getDashboardStats, createUser, getAllUsers, assignCourse, getTeachers, getStudents } from '../controllers/adminController';
import { authenticate, authorizeRole } from '../middlewares/authMiddleware';

const router = express.Router();

// All Admin routes are protected and require Admin role
router.use(authenticate, authorizeRole('ADMIN'));

router.get('/dashboard-stats', getDashboardStats);
router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/teachers', getTeachers);
router.get('/students', getStudents);
router.post('/assign-course', assignCourse);

export default router;
