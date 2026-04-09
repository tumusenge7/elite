const mysql = require('mysql2');
require('dotenv').config({ path: './backend/.env' });

const connection = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1', // Use IP
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Failed to connect to MySQL Server:', err.message);
        console.error('Check if your MySQL server is RUNNING (e.g. XAMPP, WAMP, or MySQL Service).');
        process.exit(1);
    }
    console.log('✅ Connected to MySQL Server.');

    connection.query('CREATE DATABASE IF NOT EXISTS construction_db', (err) => {
        if (err) {
            console.error('❌ Failed to create database:', err.message);
        } else {
            console.log('✅ Database "construction_db" ensured.');
        }
        connection.end();
        process.exit(0);
    });
});
