const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

async function init() {
    // 1. Connect to default 'postgres' db to create 'pothole_db'
    const client = new Client({ ...dbConfig, database: 'postgres' });
    try {
        await client.connect();

        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'pothole_trial_2'");
        if (res.rowCount === 0) {
            console.log("Creating database 'pothole_trial_2'...");
            await client.query('CREATE DATABASE pothole_trial_2');
        } else {
            console.log("Database 'pothole_trial_2' already exists.");
        }
        await client.end();

        // 2. Connect to 'pothole_trial_2' and run init.sql
        const dbClient = new Client({ ...dbConfig, database: 'pothole_trial_2' });
        await dbClient.connect();

        const sqlPath = path.join(__dirname, '../init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Running init.sql...");
        await dbClient.query(sql);
        console.log("Database initialized successfully!");
        await dbClient.end();

    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

init();
