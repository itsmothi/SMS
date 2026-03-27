import pool from '../config/db';

const checkUser = async () => {
  try {
    const [users]: any = await pool.query(
      `SELECT u.id, u.username, u.password, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.username = 'admin'`
    );
    console.log('User found:', JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error checking user:', error);
    process.exit(1);
  }
};

checkUser();
