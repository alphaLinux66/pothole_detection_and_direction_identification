const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT || 5432,
});

async function listDbs() {
    try {
        await client.connect();
        const res = await client.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
        console.log('Databases:');
        res.rows.forEach(row => console.log('-', row.datname));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

listDbs();
