"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRole)('STUDENT'));
router.get('/profile', studentController_1.getMyProfile);
router.get('/attendance', studentController_1.getMyAttendance);
router.get('/marks', studentController_1.getMyMarks);
exports.default = router;
