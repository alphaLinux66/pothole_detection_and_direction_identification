-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Potholes Table
CREATE TABLE IF NOT EXISTS potholes (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    severity VARCHAR(50),
    confidence NUMERIC,
    detected BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Index for Spatial Queries
CREATE INDEX IF NOT EXISTS potholes_location_idx ON potholes USING GIST (location);
