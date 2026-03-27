"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// All Admin routes are protected and require Admin role
router.use(authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRole)('ADMIN'));
router.get('/dashboard-stats', adminController_1.getDashboardStats);
router.post('/users', adminController_1.createUser);
router.get('/users', adminController_1.getAllUsers);
router.post('/assign-course', adminController_1.assignCourse);
exports.default = router;
