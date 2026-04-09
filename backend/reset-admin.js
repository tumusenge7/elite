const db = require('./config/db');
const bcrypt = require('bcryptjs');

const reset = async () => {
    try {
        console.log('🔄 Hashing new password "admin123"...');
        const hash = await bcrypt.hash('admin123', 10);
        
        console.log('📦 Updating user "admin@gmail.com"...');
        db.query('UPDATE users SET password = ? WHERE username = ?', [hash, 'admin@gmail.com'], (err, results) => {
            if (err) {
                console.error('❌ SQL Error:', err.message);
                process.exit(1);
            }
            
            if (results.affectedRows === 0) {
                console.log('⚠️ User not found. Attempting to create user...');
                db.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin@gmail.com', hash], (err) => {
                    if (err) {
                        console.error('❌ Failed to create user:', err.message);
                        process.exit(1);
                    }
                    console.log('✅ Success! User "admin@gmail.com" created with password "admin123".');
                    process.exit(0);
                });
            } else {
                console.log('✅ Success! Password updated for "admin@gmail.com".');
                process.exit(0);
            }
        });
    } catch (e) {
        console.error('❌ Error:', e.message);
        process.exit(1);
    }
};

reset();
