const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pothole_db',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT || 5432,
});

async function check() {
    try {
        await client.connect();
        console.log('Connected to DB');

        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        console.log('Tables in public schema:');
        res.rows.forEach(row => console.log('-', row.table_name));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

check();
