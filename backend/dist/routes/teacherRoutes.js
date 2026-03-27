"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherController_1 = require("../controllers/teacherController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Require Teacher role
router.use(authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRole)('TEACHER'));
router.get('/my-courses', teacherController_1.getMyCourses);
router.get('/course/:courseId/students', teacherController_1.getStudentsPerCourse);
router.post('/attendance', teacherController_1.markAttendance);
router.post('/assessment', teacherController_1.createAssessment);
router.post('/marks', teacherController_1.uploadMarks);
exports.default = router;
