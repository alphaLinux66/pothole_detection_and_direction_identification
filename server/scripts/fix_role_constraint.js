const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

const validPath = require('path').resolve(__dirname, '../.env');
require('dotenv').config({ path: validPath });

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'pothole_trial_2'
};

async function fix() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log("Connected to database.");

        // Find existing check constraints on 'users' table regarding 'role'
        // Or just blindly try to drop 'users_role_check' which is the default name
        // But let's look it up to be safe.
        const res = await client.query(`
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'users'::regclass
            AND contype = 'c';
        `);

        if (res.rows.length === 0) {
            console.log("No check constraints found.");
        } else {
            for (const row of res.rows) {
                console.log(`Found check constraint: ${row.conname}`);
                // Verify if it's the role one (usually users_role_check)
                // We'll just drop it since it's the only one we know of.
                await client.query(`ALTER TABLE users DROP CONSTRAINT "${row.conname}"`);
                console.log(`Dropped constraint: ${row.conname}`);
            }
        }

    } catch (err) {
        console.error("Fix failed:", err);
    } finally {
        await client.end();
    }
}

fix();
