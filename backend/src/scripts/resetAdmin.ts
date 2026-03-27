import bcrypt from 'bcrypt';
import pool from '../config/db';

const resetAdmin = async () => {
  try {
    const defaultPassword = 'admin';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Get ADMIN role id
    const [roles]: any = await pool.query(`SELECT id FROM roles WHERE role_name = 'ADMIN'`);
    if (roles.length === 0) {
      console.log('Roles not found.');
      process.exit(1);
    }
    const adminRoleId = roles[0].id;

    // Use REPLACE or update logic
    await pool.query(
      `INSERT INTO users (username, password, dob, role_id, is_first_login) 
       VALUES (?, ?, ?, ?, TRUE) 
       ON DUPLICATE KEY UPDATE password = ?, is_first_login = TRUE`,
      ['admin', hashedPassword, '1990-01-01', adminRoleId, hashedPassword]
    );

    console.log('Successfully reset Admin user to admin/admin');
    process.exit(0);
  } catch (error) {
    console.error('Failed to reset admin:', error);
    process.exit(1);
  }
};

resetAdmin();
