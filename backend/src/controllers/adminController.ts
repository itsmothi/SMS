import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [studentsCount]: any = await pool.query(`SELECT COUNT(*) as count FROM students`);
    const [teachersCount]: any = await pool.query(`SELECT COUNT(*) as count FROM teachers`);
    const [coursesCount]: any = await pool.query(`SELECT COUNT(*) as count FROM courses`);

    console.log('Stats fetched:', { students: studentsCount[0].count, teachers: teachersCount[0].count, courses: coursesCount[0].count });


    res.json({
      success: true,
      stats: {
        students: studentsCount[0].count,
        teachers: teachersCount[0].count,
        courses: coursesCount[0].count,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, dob, role_name, full_name, email, branch, year, department } = req.body;

    // Check if username already exists
    const [existingUser]: any = await pool.query(`SELECT id FROM users WHERE username = ?`, [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    
    // Validate role
    const [roleResult]: any = await pool.query(`SELECT id FROM roles WHERE role_name = ?`, [role_name.toUpperCase()]);
    if (roleResult.length === 0) return res.status(400).json({ success: false, message: 'Invalid role' });
    const roleId = roleResult[0].id;

    // Default password is DOB (YYYY-MM-DD expected)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dob, salt);

    // Start Transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      console.log(`Creating user: ${username}, Role: ${role_name}`);
      const [userInsertResult]: any = await connection.query(
        `INSERT INTO users (username, password, dob, role_id, is_first_login) VALUES (?, ?, ?, ?, TRUE)`,
        [username, hashedPassword, dob, roleId]
      );
      const userId = userInsertResult.insertId;
      console.log(`User created with ID: ${userId}, adding to ${role_name} table...`);

      if (role_name.toUpperCase() === 'STUDENT') {
        await connection.query(
          `INSERT INTO students (user_id, full_name, email, branch, year) VALUES (?, ?, ?, ?, ?)`,
          [userId, full_name, email, branch, year]
        );
      } else if (role_name.toUpperCase() === 'TEACHER') {
        await connection.query(
          `INSERT INTO teachers (user_id, full_name, email, department) VALUES (?, ?, ?, ?)`,
          [userId, full_name, email, department]
        );
      } else {
         console.log(`Role ${role_name} handled as Base User`);
      }

      await connection.commit();
      console.log(`Transaction committed for ${username}`);
      res.status(201).json({ success: true, message: 'User created successfully', userId });
    } catch (err) {
      console.error('Error in user creation transaction:', err);
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [users]: any = await pool.query(`
      SELECT u.id, u.username, u.dob, u.is_first_login, r.role_name 
      FROM users u JOIN roles r ON u.role_id = r.id
    `);
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [teachers]: any = await pool.query(`
      SELECT t.id, t.full_name, t.email, t.department, u.username 
      FROM teachers t JOIN users u ON t.user_id = u.id
    `);
    console.log(`Fetched ${teachers.length} teachers for admin`);
    res.json({ success: true, teachers });
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [students]: any = await pool.query(`
      SELECT s.id, s.full_name, s.email, s.branch, s.year, u.username 
      FROM students s JOIN users u ON s.user_id = u.id
    `);
    res.json({ success: true, students });
  } catch (error) {
    next(error);
  }
};

export const assignCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { course_code, course_name, teacher_id } = req.body;
    
    // Simple upsert logic for courses, or just insert
    await pool.query(
      `INSERT INTO courses (course_code, course_name, teacher_id) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE teacher_id = ?`,
      [course_code, course_name, teacher_id, teacher_id]
    );

    res.json({ success: true, message: 'Course assigned to teacher successfully' });
  } catch (error) {
    next(error);
  }
};
