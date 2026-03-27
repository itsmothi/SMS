"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../config/db"));
const jwt_1 = require("../utils/jwt");
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide username and password' });
        }
        const [users] = await db_1.default.query(`SELECT u.*, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.username = ?`, [username]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const user = users[0];
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            role: user.role_name,
            is_first_login: user.is_first_login ? true : false
        });
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role_name,
                is_first_login: user.is_first_login ? true : false
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const changePassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide new password' });
        }
        const userId = req.user?.id;
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(newPassword, salt);
        await db_1.default.query(`UPDATE users SET password = ?, is_first_login = FALSE WHERE id = ?`, [hashedPassword, userId]);
        res.json({ success: true, message: 'Password changed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
