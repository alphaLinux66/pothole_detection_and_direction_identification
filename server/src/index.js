const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const potholeRoutes = require('./routes/potholes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/potholes', potholeRoutes);

app.get('/', (req, res) => {
    res.send('Pothole Detection API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
