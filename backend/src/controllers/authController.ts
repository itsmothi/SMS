import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/authMiddleware';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const [users]: any = await pool.query(
      `SELECT u.*, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.username = ?`, 
      [username]
    );

    if (users.length === 0) {
      console.log(`Login failed: User ${username} not found`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    console.log(`User found: ${user.username}, comparing password...`);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result: ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken({
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

  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide new password' });
    }

    const userId = req.user?.id;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query(
      `UPDATE users SET password = ?, is_first_login = FALSE WHERE id = ?`,
      [hashedPassword, userId]
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
