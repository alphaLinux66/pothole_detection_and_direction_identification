# Pothole Detection System

A full-stack application for detecting potholes using YOLOv8 and alerting travellers about potholes on their route.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + Leaflet
- **Backend**: Node.js + Express + PostgreSQL (PostGIS)
- **Microservice**: Python FastAPI + YOLOv8

## Prerequisites
- Docker & Docker Compose
- Node.js (for local development)
- Python 3.9+ (for local development)

## Setup & Run

1. **Clone the repository** (if applicable)

2. **Environment Setup**
   Copy `.env.example` to `.env` in the root (or set env vars in docker-compose).
   The default values in `docker-compose.yml` should work out of the box.

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```
   This will start:
   - Postgres DB on port 5432
   - Python Service on port 8000
   - Node Backend on port 3000

4. **Run Frontend**
   Since the frontend is not strictly dockerized in the compose file (to allow easier local dev), run it locally:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

## Features

### Reporter
- Register/Login.
- Upload an image of a pothole.
- Click on the map to set the location.
- View submitted potholes and their severity.

### Traveller
- Register/Login.
- Enter Source and Destination (e.g., "London" to "Paris" - mock geocoding).
- View the route on the map.
- See potholes along the route (within 20m).
- Get alerts if potholes are detected.

## API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Potholes
- `POST /potholes/upload` (multipart/form-data: image, lat, lng)
- `GET /potholes/mine`
- `POST /potholes/along-route` (body: { routePoints: [[lng, lat], ...] })

### Detection (Python)
- `POST /detect` (multipart/form-data: file)
