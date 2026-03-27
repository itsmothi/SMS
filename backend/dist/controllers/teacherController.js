"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentsPerCourse = exports.uploadMarks = exports.createAssessment = exports.markAttendance = exports.getMyCourses = void 0;
const db_1 = __importDefault(require("../config/db"));
// Utility to get teacher ID from user ID
const getTeacherId = async (userId) => {
    const [teachers] = await db_1.default.query(`SELECT id FROM teachers WHERE user_id = ?`, [userId]);
    if (teachers.length === 0)
        return null;
    return teachers[0].id;
};
const getMyCourses = async (req, res, next) => {
    try {
        const teacherId = await getTeacherId(req.user.id);
        if (!teacherId)
            return res.status(404).json({ success: false, message: 'Teacher profile not found' });
        const [courses] = await db_1.default.query(`SELECT * FROM courses WHERE teacher_id = ?`, [teacherId]);
        res.json({ success: true, courses });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyCourses = getMyCourses;
const markAttendance = async (req, res, next) => {
    try {
        const { course_id, student_id, attendance_date, status } = req.body;
        // Add logic to verify this course belongs to the logged-in teacher if strictly needed.
        await db_1.default.query(`INSERT INTO attendance (student_id, course_id, attendance_date, status) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = ?`, [student_id, course_id, attendance_date, status, status]);
        res.json({ success: true, message: 'Attendance marked successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.markAttendance = markAttendance;
const createAssessment = async (req, res, next) => {
    try {
        const { course_id, title, max_marks } = req.body;
        await db_1.default.query(`INSERT INTO assessments (course_id, title, max_marks) VALUES (?, ?, ?)`, [course_id, title, max_marks]);
        res.status(201).json({ success: true, message: 'Assessment created successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createAssessment = createAssessment;
const uploadMarks = async (req, res, next) => {
    try {
        const { student_id, assessment_id, marks_obtained } = req.body;
        await db_1.default.query(`INSERT INTO marks (student_id, assessment_id, marks_obtained) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE marks_obtained = ?`, [student_id, assessment_id, marks_obtained, marks_obtained]);
        res.json({ success: true, message: 'Marks uploaded successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadMarks = uploadMarks;
const getStudentsPerCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const [students] = await db_1.default.query(`SELECT s.* FROM students s 
       JOIN enrollments e ON s.id = e.student_id 
       WHERE e.course_id = ?`, [courseId]);
        res.json({ success: true, students });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentsPerCourse = getStudentsPerCourse;
