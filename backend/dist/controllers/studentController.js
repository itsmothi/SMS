"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyMarks = exports.getMyAttendance = exports.getMyProfile = void 0;
const db_1 = __importDefault(require("../config/db"));
const getStudentId = async (userId) => {
    const [students] = await db_1.default.query(`SELECT id FROM students WHERE user_id = ?`, [userId]);
    if (students.length === 0)
        return null;
    return students[0].id;
};
const getMyProfile = async (req, res, next) => {
    try {
        const studentId = await getStudentId(req.user.id);
        if (!studentId)
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        const [profile] = await db_1.default.query(`SELECT * FROM students WHERE id = ?`, [studentId]);
        res.json({ success: true, profile: profile[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyProfile = getMyProfile;
const getMyAttendance = async (req, res, next) => {
    try {
        const studentId = await getStudentId(req.user.id);
        if (!studentId)
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        const [attendance] = await db_1.default.query(`SELECT a.attendance_date, a.status, c.course_code, c.course_name 
       FROM attendance a 
       JOIN courses c ON a.course_id = c.id 
       WHERE a.student_id = ?
       ORDER BY a.attendance_date DESC`, [studentId]);
        // Calculate overall percentage
        const total = attendance.length;
        const present = attendance.filter((r) => r.status === 'PRESENT').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
        res.json({ success: true, attendance, percentage });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyAttendance = getMyAttendance;
const getMyMarks = async (req, res, next) => {
    try {
        const studentId = await getStudentId(req.user.id);
        if (!studentId)
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        const [marks] = await db_1.default.query(`SELECT m.marks_obtained, a.title, a.max_marks, c.course_code, c.course_name 
       FROM marks m 
       JOIN assessments a ON m.assessment_id = a.id 
       JOIN courses c ON a.course_id = c.id 
       WHERE m.student_id = ?`, [studentId]);
        res.json({ success: true, marks });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyMarks = getMyMarks;
