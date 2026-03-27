import { Response, NextFunction } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

const getStudentId = async (userId: number): Promise<number | null> => {
  const [students]: any = await pool.query(`SELECT id FROM students WHERE user_id = ?`, [userId]);
  if (students.length === 0) return null;
  return students[0].id;
};

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = await getStudentId(req.user!.id);
    if (!studentId) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const [profile]: any = await pool.query(`SELECT * FROM students WHERE id = ?`, [studentId]);
    res.json({ success: true, profile: profile[0] });
  } catch (error) {
    next(error);
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = await getStudentId(req.user!.id);
    if (!studentId) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const [attendance]: any = await pool.query(
      `SELECT a.attendance_date, a.status, c.course_code, c.course_name 
       FROM attendance a 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.student_id = ?
       ORDER BY a.attendance_date DESC`,
      [studentId]
    );

    // Calculate overall percentage
    const total = attendance.length;
    const present = attendance.filter((r: any) => r.status === 'PRESENT').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({ success: true, attendance, percentage });
  } catch (error) {
    next(error);
  }
};

export const getMyMarks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = await getStudentId(req.user!.id);
    if (!studentId) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const [marks]: any = await pool.query(
      `SELECT m.marks_obtained, a.title, a.max_marks, c.course_code, c.course_name 
       FROM marks m 
       JOIN assessments a ON m.assessment_id = a.id 
       JOIN courses c ON a.course_id = c.id 
       WHERE m.student_id = ?`,
      [studentId]
    );

    res.json({ success: true, marks });
  } catch (error) {
    next(error);
  }
};
