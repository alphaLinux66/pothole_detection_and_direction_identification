const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const pool = require('./db');

const authRoutes = require('./routes/auth');
const potholeRoutes = require('./routes/potholes');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors({
    origin: [
        'https://pothole-detection-and-direction-ide-drab.vercel.app',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// IMPORTANT: handle preflight
app.options('*', cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/potholes', potholeRoutes);

app.get('/', (req, res) => {
    res.send('Pothole Detection API is running');
});

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS time');
        res.json({
            success: true,
            message: "Database connection OK",
            time: result.rows[0].time
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Database connection FAILED",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
