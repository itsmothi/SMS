"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignCourse = exports.getAllUsers = exports.createUser = exports.getDashboardStats = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = async (req, res, next) => {
    try {
        const [studentsCount] = await db_1.default.query(`SELECT COUNT(*) as count FROM students`);
        const [teachersCount] = await db_1.default.query(`SELECT COUNT(*) as count FROM teachers`);
        const [coursesCount] = await db_1.default.query(`SELECT COUNT(*) as count FROM courses`);
        res.json({
            success: true,
            stats: {
                students: studentsCount[0].count,
                teachers: teachersCount[0].count,
                courses: coursesCount[0].count,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
const createUser = async (req, res, next) => {
    try {
        const { username, dob, role_name, full_name, email, branch, year, department } = req.body;
        // Validate role
        const [roleResult] = await db_1.default.query(`SELECT id FROM roles WHERE role_name = ?`, [role_name.toUpperCase()]);
        if (roleResult.length === 0)
            return res.status(400).json({ success: false, message: 'Invalid role' });
        const roleId = roleResult[0].id;
        // Default password is DOB (YYYY-MM-DD expected)
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(dob, salt);
        // Start Transaction
        const connection = await db_1.default.getConnection();
        await connection.beginTransaction();
        try {
            const [userInsertResult] = await connection.query(`INSERT INTO users (username, password, dob, role_id, is_first_login) VALUES (?, ?, ?, ?, TRUE)`, [username, hashedPassword, dob, roleId]);
            const userId = userInsertResult.insertId;
            if (role_name.toUpperCase() === 'STUDENT') {
                await connection.query(`INSERT INTO students (user_id, full_name, email, branch, year) VALUES (?, ?, ?, ?, ?)`, [userId, full_name, email, branch, year]);
            }
            else if (role_name.toUpperCase() === 'TEACHER') {
                await connection.query(`INSERT INTO teachers (user_id, full_name, email, department) VALUES (?, ?, ?, ?)`, [userId, full_name, email, department]);
            }
            else {
                // Create Admin if required
            }
            await connection.commit();
            res.status(201).json({ success: true, message: 'User created successfully', userId });
        }
        catch (err) {
            await connection.rollback();
            throw err;
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const getAllUsers = async (req, res, next) => {
    try {
        const [users] = await db_1.default.query(`
      SELECT u.id, u.username, u.dob, u.is_first_login, r.role_name 
      FROM users u JOIN roles r ON u.role_id = r.id
    `);
        res.json({ success: true, users });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const assignCourse = async (req, res, next) => {
    try {
        const { course_code, course_name, teacher_id } = req.body;
        // Simple upsert logic for courses, or just insert
        await db_1.default.query(`INSERT INTO courses (course_code, course_name, teacher_id) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE teacher_id = ?`, [course_code, course_name, teacher_id, teacher_id]);
        res.json({ success: true, message: 'Course assigned to teacher successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.assignCourse = assignCourse;
