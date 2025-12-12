const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const potholeController = require('../controllers/potholeController');
const authenticateToken = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post('/upload', authenticateToken, upload.single('image'), potholeController.uploadPothole);
router.get('/mine', authenticateToken, potholeController.getMyPotholes);
router.post('/routes', authenticateToken, potholeController.getSafeRoutes);

module.exports = router;
