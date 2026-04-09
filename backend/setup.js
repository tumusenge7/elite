const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: 3306
});

console.log('🔧 Setting up database...');

connection.connect(async (err) => {
    if (err) {
        console.error(' Connection failed:', err.message);
        process.exit(1);
    }

    console.log(' Connected to MySQL');

    // Create database
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'construction_db'}`, (err) => {
        if (err) {
            console.error(' Database creation failed:', err.message);
            process.exit(1);
        }

        console.log(' Database ready');
        connection.changeUser({ database: process.env.DB_NAME || 'construction_db' }, (err) => {
            if (err) {
                console.error(' Database selection failed:', err.message);
                process.exit(1);
            }

            // Create tables
            const createProjectsTable = `
                CREATE TABLE IF NOT EXISTS projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    category VARCHAR(100) NOT NULL,
                    location VARCHAR(255),
                    image TEXT,
                    description TEXT,
                    year INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;

            const createServicesTable = `
                CREATE TABLE IF NOT EXISTS services (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;

            const createMessagesTable = `
                CREATE TABLE IF NOT EXISTS messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    subject VARCHAR(255),
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            connection.query(createProjectsTable, (err) => {
                if (err) console.error('Projects table error:', err);
                else console.log(' Projects table ready');
            });

            connection.query(createServicesTable, (err) => {
                if (err) console.error('Services table error:', err);
                else console.log(' Services table ready');
            });

            connection.query(createMessagesTable, (err) => {
                if (err) console.error('Messages table error:', err);
                else console.log(' Messages table ready');
            });

            console.log('\n Database setup complete!');
            console.log(' You can now run: npm run dev');
            console.log(' Login with: admin@example.com / admin123\n');

            setTimeout(() => {
                connection.end();
            }, 2000);
        });
    });
});