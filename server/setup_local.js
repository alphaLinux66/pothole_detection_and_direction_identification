const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT || 5432,
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        // Check if database exists
        const dbName = process.env.DB_NAME || 'pothole_db';
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rowCount === 0) {
            console.log(`Creating database ${dbName}...`);
            await client.query(`CREATE DATABASE ${dbName}`);
        } else {
            console.log(`Database ${dbName} already exists`);
        }
    } catch (err) {
        console.error('Error connecting/creating DB:', err);
    } finally {
        await client.end();
    }

    // Connect to the specific database to run init.sql
    const dbClient = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'pothole_db',
        password: process.env.DB_PASSWORD || 'root',
        port: process.env.DB_PORT || 5432,
    });

    try {
        await dbClient.connect();
        console.log('Connected to pothole_db');

        // Adjust path to init.sql which is in parent directory
        const initSqlPath = path.join(__dirname, '../init.sql');
        if (fs.existsSync(initSqlPath)) {
            const initSql = fs.readFileSync(initSqlPath, 'utf8');
            await dbClient.query(initSql);
            console.log('Successfully ran init.sql');
        } else {
            console.error('Could not find init.sql at', initSqlPath);
        }
    } catch (err) {
        console.error('Error running init.sql:', err);
    } finally {
        await dbClient.end();
    }
}

run();
