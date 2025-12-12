const { Client } = require('pg');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed, assuming running from server root or similar

const validPath = require('path').resolve(__dirname, '../.env');
require('dotenv').config({ path: validPath });

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'pothole_trial_2' // We know the DB name
};

async function migrate() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log("Connected to database. updating roles...");
        const res = await client.query("UPDATE users SET role = 'USER'");
        console.log(`Updated ${res.rowCount} users to role 'USER'.`);
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

migrate();
