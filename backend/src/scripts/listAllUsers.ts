import pool from '../config/db';

const checkUsers = async () => {
    try {
        const [users]: any = await pool.query('SELECT username, dob, role_id FROM users');
        const [students]: any = await pool.query('SELECT * FROM students');
        const [teachers]: any = await pool.query('SELECT * FROM teachers');
        
        console.log('--- USERS ---');
        console.log(JSON.stringify(users, null, 2));
        console.log('--- STUDENTS ---');
        console.log(JSON.stringify(students, null, 2));
        console.log('--- TEACHERS ---');
        console.log(JSON.stringify(teachers, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error checking database:', error);
        process.exit(1);
    }
};

checkUsers();
