const db = require('../db');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || process.env.PYTHON_URL || 'http://127.0.0.1:8000';

const uploadPothole = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const { lat, lng } = req.body;
    const userId = req.user.id;
    const filePath = req.file.path;

    try {
        // Call Python Service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const detectionResponse = await axios.post(`${PYTHON_SERVICE_URL}/detect`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        const { pothole_detected, confidence, severity: detectedSeverity } = detectionResponse.data;

        // Prioritize manual severity if provided, otherwise use detection result
        const severity = req.body.severity || detectedSeverity;

        // Save to DB
        // We store the file path relative to uploads directory or a public URL if we were using S3
        // For now, we just store the filename
        const imageUrl = `/uploads/${req.file.filename}`;

        const query = `
      INSERT INTO potholes (image_url, location, severity, confidence, detected, created_by)
      VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6, $7)
      RETURNING id, image_url, severity, confidence, detected
    `;

        const result = await db.query(query, [
            imageUrl,
            lng,
            lat,
            severity,
            confidence,
            pothole_detected,
            userId,
        ]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error processing pothole:', error);
        res.status(500).json({ error: 'Failed to process pothole' });
    }
};

const getMyPotholes = async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `
      SELECT id, image_url, severity, confidence, detected, created_at,
             ST_X(location::geometry) as lng, ST_Y(location::geometry) as lat
      FROM potholes
      WHERE created_by = $1
      ORDER BY created_at DESC
    `;
        const result = await db.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch potholes' });
    }
};

const polyline = require('@mapbox/polyline');

const getSafeRoutes = async (req, res) => {
    const { start, end } = req.body; // Expects [lat, lng] format for both

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and End coordinates required' });
    }

    try {
        // 1. Fetch routes from OSRM (using 'driving' profile)
        // OSRM expects coordinates in [lng, lat] format
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&alternatives=3&geometries=polyline`;

        const osrmRes = await axios.get(osrmUrl);
        const routes = osrmRes.data.routes;

        if (!routes || routes.length === 0) {
            return res.status(404).json({ error: 'No routes found' });
        }

        // 2. Analyze each route for potholes
        const analyzedRoutes = await Promise.all(routes.map(async (route, index) => {
            // Decode polyline to get points [lat, lng]
            // We need to convert them to [lng, lat] for PostGIS LineString
            const points = polyline.decode(route.geometry).map(p => `${p[1]} ${p[0]}`);
            const lineStringWKT = `LINESTRING(${points.join(',')})`;

            // Query potholes within 20m of this route
            const query = `
                SELECT id, severity, confidence, detected, 
                       ST_X(location::geometry) as lng, ST_Y(location::geometry) as lat
                FROM potholes
                WHERE ST_DWithin(
                    location,
                    ST_GeogFromText($1),
                    20
                )
            `;

            const dbRes = await db.query(query, [lineStringWKT]);
            const potholes = dbRes.rows;

            // Calculate Stats
            let highCount = 0;
            let mediumCount = 0;
            let lowCount = 0;

            potholes.forEach(p => {
                if (p.severity === 'High') highCount++;
                if (p.severity === 'Medium') mediumCount++;
                if (p.severity === 'Low') lowCount++;
            });

            const totalPotholes = highCount + mediumCount + lowCount;
            const severityScore = (highCount * 3) + (mediumCount * 2) + (lowCount * 1);

            return {
                id: index,
                geometry: route.geometry, // Keep original encoded polyline for frontend
                duration: route.duration, // Seconds
                distance: route.distance, // Meters
                stats: {
                    total: totalPotholes,
                    high: highCount,
                    medium: mediumCount,
                    low: lowCount,
                    score: severityScore
                },
                potholes: potholes // Return individual potholes for mapping
            };
        }));

        res.json(analyzedRoutes);

    } catch (error) {
        console.error("Route calculation error:", error);
        res.status(500).json({ error: 'Failed to calculate safe routes' });
    }
};

module.exports = { uploadPothole, getMyPotholes, getSafeRoutes };
