import express from 'express';
import { getMyCourses, markAttendance, createAssessment, uploadMarks, getStudentsPerCourse } from '../controllers/teacherController';
import { authenticate, authorizeRole } from '../middlewares/authMiddleware';

const router = express.Router();

// Require Teacher role
router.use(authenticate, authorizeRole('TEACHER'));

router.get('/my-courses', getMyCourses);
router.get('/course/:courseId/students', getStudentsPerCourse);
router.post('/attendance', markAttendance);
router.post('/assessment', createAssessment);
router.post('/marks', uploadMarks);

export default router;
