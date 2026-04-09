const db = require('./backend/config/db');

const tables = [
    {
        name: 'projects',
        sql: `CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            location VARCHAR(255),
            description TEXT,
            image VARCHAR(255),
            year VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    },
    {
        name: 'messages',
        sql: `CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            subject VARCHAR(255),
            message TEXT NOT NULL,
            status ENUM('new', 'read', 'archived') DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    },
    {
        name: 'services',
        sql: `CREATE TABLE IF NOT EXISTS services (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            detailed_description TEXT,
            main_image VARCHAR(255),
            gallery_images TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    },
    {
        name: 'users',
        sql: `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    }
];

const syncDB = async () => {
    console.log('🔄 Syncing Database Schema...');
    for (const table of tables) {
        try {
            await new Promise((resolve, reject) => {
                db.query(table.sql, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            console.log(`✅ Table '${table.name}' synchronised.`);
        } catch (err) {
            console.error(`❌ Error synchronising table '${table.name}':`, err.message);
        }
    }
    console.log('🚀 Database sync complete.');
    process.exit(0);
};

syncDB();
