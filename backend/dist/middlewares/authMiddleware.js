"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        // Check if the user needs to change their password (force password change on first login)
        // We allow access to the password change route even if it's their first login
        if (decoded.is_first_login && req.path !== '/change-password') {
            return res.status(403).json({ success: false, message: 'Please change your password first.', is_first_login: true });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};
exports.authenticate = authenticate;
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not have the required role' });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
