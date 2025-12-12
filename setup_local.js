const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    port: 5432,
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        // Check if database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'pothole_db'");
        if (res.rowCount === 0) {
            console.log('Creating database pothole_db...');
            await client.query('CREATE DATABASE pothole_db');
        } else {
            console.log('Database pothole_db already exists');
        }
    } catch (err) {
        console.error('Error connecting/creating DB:', err);
    } finally {
        await client.end();
    }

    // Connect to the specific database to run init.sql
    const dbClient = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'pothole_db',
        password: 'root',
        port: 5432,
    });

    try {
        await dbClient.connect();
        console.log('Connected to pothole_db');

        const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
        await dbClient.query(initSql);
        console.log('Successfully ran init.sql');
    } catch (err) {
        console.error('Error running init.sql:', err);
    } finally {
        await dbClient.end();
    }
}

run();
