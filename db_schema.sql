-- Enable PostGIS Extension
-- NOTE: In Supabase, you might need to enable this in the dashboard under Database > Extensions if this fails.
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('USER', 'REPORTER', 'TRAVELLER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Potholes Table
CREATE TABLE IF NOT EXISTS potholes (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    lat NUMERIC, -- redundancy for easier querying if needed, but GIS is primary
    lng NUMERIC,
    severity VARCHAR(50),
    confidence NUMERIC,
    detected BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Spatial Index for Fast Location Queries
CREATE INDEX IF NOT EXISTS potholes_location_idx ON potholes USING GIST (location);

-- 4. Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE potholes ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Open access for now, tighten as needed)
CREATE POLICY "Public Read Access" ON potholes FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON potholes FOR INSERT WITH CHECK (true);
