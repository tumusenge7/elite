const db = require('./backend/config/db');
const bcrypt = require('bcryptjs');

const reset = async () => {
    try {
        console.log('🔄 Hashing password...');
        const hash = await bcrypt.hash('admin123', 10);
        console.log('📦 Updating database for admin@gmail.com...');
        
        db.query('UPDATE users SET password = ? WHERE username = ?', [hash, 'admin@gmail.com'], (err, results) => {
            if (err) {
                console.error('❌ SQL Error:', err.message);
                process.exit(1);
            }
            console.log(`✅ Success! Rows affected: ${results.affectedRows}`);
            process.exit(0);
        });
    } catch (e) {
        console.error('❌ Error:', e.message);
        process.exit(1);
    }
};

reset();
