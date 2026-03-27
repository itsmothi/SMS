import { Response, NextFunction } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// Utility to get teacher ID from user ID
const getTeacherId = async (userId: number): Promise<number | null> => {
  const [teachers]: any = await pool.query(`SELECT id FROM teachers WHERE user_id = ?`, [userId]);
  if (teachers.length === 0) return null;
  return teachers[0].id;
};

export const getMyCourses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const teacherId = await getTeacherId(req.user!.id);
    if (!teacherId) return res.status(404).json({ success: false, message: 'Teacher profile not found' });

    const [courses]: any = await pool.query(`SELECT * FROM courses WHERE teacher_id = ?`, [teacherId]);
    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

export const markAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { course_id, student_id, attendance_date, status } = req.body;
    
    // Add logic to verify this course belongs to the logged-in teacher if strictly needed.
    await pool.query(
      `INSERT INTO attendance (student_id, course_id, attendance_date, status) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = ?`,
      [student_id, course_id, attendance_date, status, status]
    );

    res.json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    next(error);
  }
};

export const createAssessment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { course_id, title, max_marks } = req.body;
    await pool.query(
      `INSERT INTO assessments (course_id, title, max_marks) VALUES (?, ?, ?)`,
      [course_id, title, max_marks]
    );
    res.status(201).json({ success: true, message: 'Assessment created successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadMarks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { student_id, assessment_id, marks_obtained } = req.body;
    await pool.query(
      `INSERT INTO marks (student_id, assessment_id, marks_obtained) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE marks_obtained = ?`,
      [student_id, assessment_id, marks_obtained, marks_obtained]
    );
    res.json({ success: true, message: 'Marks uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

export const getStudentsPerCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const [students]: any = await pool.query(
      `SELECT s.* FROM students s 
       JOIN enrollments e ON s.id = e.student_id 
       WHERE e.course_id = ?`,
      [courseId]
    );
    res.json({ success: true, students });
  } catch (error) {
    next(error);
  }
};
