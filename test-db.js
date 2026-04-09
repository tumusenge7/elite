const mysql = require('mysql2');
require('dotenv').config({ path: './backend/.env' });

console.log('--- DB Config ---');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('DB:', process.env.DB_NAME);
console.log('Pass:', process.env.DB_PASSWORD ? '********' : '(empty)');
console.log('------------------');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'construction_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ FULL ERROR:', err);
        process.exit(1);
    }
    console.log('✅ Success!');
    db.end();
});
