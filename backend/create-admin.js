const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'elite_construction'
    });

    try {
        // Check if admin exists
        const [existing] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            ['admin@elite.com']
        );

        if (existing.length > 0) {
            console.log('Admin user already exists');
            // Update password to ensure it works
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.execute(
                'UPDATE users SET password = ? WHERE email = ?',
                [hashedPassword, 'admin@elite.com']
            );
            console.log('Admin password updated to: admin123');
        } else {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin', 'admin@elite.com', hashedPassword, 'admin']
            );
            console.log('Admin user created successfully');
        }

        console.log('\nAdmin Credentials:');
        console.log('Email: admin@elite.com');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await connection.end();
    }
}

createAdminUser();