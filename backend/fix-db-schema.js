const db = require('./config/db');

const fix = async () => {
    try {
        console.log(' Checking columns for projects table...');

        db.query('DESCRIBE projects', (err, results) => {
            if (err) {
                console.error(' Error describing table:', err.message);
                process.exit(1);
            }

            const fields = results.map(r => r.Field);

            if (!fields.includes('location')) {
                console.log(' Adding location column...');
                db.query('ALTER TABLE projects ADD COLUMN location VARCHAR(255) AFTER category', (err) => {
                    if (err) console.error(' Failed to add location:', err.message);
                    else console.log(' Location column added.');

                    checkYear(fields);
                });
            } else {
                console.log('ℹ Location column already exists.');
                checkYear(fields);
            }
        });
    } catch (e) {
        console.error(' Error:', e.message);
        process.exit(1);
    }
};

const checkYear = (fields) => {
    if (!fields.includes('year')) {
        console.log(' Adding year column...');
        db.query('ALTER TABLE projects ADD COLUMN year VARCHAR(50) AFTER image', (err) => {
            if (err) console.error(' Failed to add year:', err.message);
            else console.log(' Year column added.');
            process.exit(0);
        });
    } else {
        console.log('ℹ Year column already exists.');
        process.exit(0);
    }
}

fix();
