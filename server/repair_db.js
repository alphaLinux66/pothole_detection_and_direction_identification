const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pothole_db',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT || 5432,
});

async function repair() {
    try {
        await client.connect();
        console.log('Connected to DB');

        console.log('Attempting to create users table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Users table created or already exists.');

        // Verify it exists now
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'users'
        `);

        if (res.rows.length > 0) {
            console.log('VERIFIED: users table exists.');
        } else {
            console.error('ERROR: users table still missing!');
        }

    } catch (err) {
        console.error('Error during repair:', err);
    } finally {
        await client.end();
    }
}

repair();
