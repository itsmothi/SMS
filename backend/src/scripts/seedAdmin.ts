import bcrypt from 'bcrypt';
import pool from '../config/db';

const seedAdmin = async () => {
  try {
    const defaultPassword = 'admin';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Get ADMIN role id
    const [roles]: any = await pool.query(`SELECT id FROM roles WHERE role_name = 'ADMIN'`);
    if (roles.length === 0) {
      console.log('Roles not found. Make sure you ran the INSERT INTO roles statement in schema.sql');
      process.exit(1);
    }
    const adminRoleId = roles[0].id;

    // Check if admin already exists
    const [users]: any = await pool.query(`SELECT id FROM users WHERE username = 'admin'`);
    if (users.length > 0) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Insert Admin
    await pool.query(
      `INSERT INTO users (username, password, dob, role_id, is_first_login) VALUES (?, ?, ?, ?, TRUE)`,
      ['admin', hashedPassword, '1990-01-01', adminRoleId]
    );

    console.log('Successfully created default Admin user!');
    console.log('Username: admin');
    console.log('Password: admin');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error);
    process.exit(1);
  }
};

seedAdmin();
