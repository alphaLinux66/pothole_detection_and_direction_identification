# Project Startup Guide

Use this guide to start the "Pothole Detection System" from a fresh state (e.g., after restarting your computer or closing your IDE).

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **Docker Desktop** (Required for the Database)

---

## Option 1: The "Hybrid" Approach (Recommended)
This method uses Docker for the heavy lifting (Database, Backend, Python Service) but allows you to run the Frontend locally for easy access.

### 1. Start Support Services (DB, Backend, Python)
Open a terminal in the project root (`d:\project\pothole_trial_2`) and run:
```bash
docker-compose up --build
```
*Wait until you see logs indicating the database is ready and services are listening.*

### 2. Start the Frontend
Open a **new** terminal window, navigate to the client folder, and start the app:
```bash
cd client
npm run dev
```

**Access the App:** Open [http://localhost:5173](http://localhost:5173)

---

## Option 2: Manual Startup (Full Control)
If you prefer to run everything manually (without Docker Compose for services), follow this exact order. You will need **4 separate terminal windows**.

### Terminal 1: Database
*You must have a PostgreSQL + PostGIS instance running.*
If using Docker just for the DB:
```bash
docker run --name pothole_db -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgis/postgis:15-3.3
```

### Terminal 2: Python Service (AI Detection)
Navigate to the python service directory:
```bash
cd python-service
```
Activate your virtual environment (if you have one created):
```bash
# Windows
.\venv\Scripts\activate
# OR if using raw python
pip install -r requirements.txt
```
Start the service:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 3: Backend Server (API)
Navigate to the server directory:
```bash
cd server
```
Install dependencies (first time only):
```bash
npm install
```
Start the server:
```bash
npm run dev
```

### Terminal 4: Frontend Client (UI)
Navigate to the client directory:
```bash
cd client
```
Install dependencies (first time only):
```bash
npm install
```
Start the client:
```bash
npm run dev
```

---

## Verification
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend Health**: [http://localhost:3000](http://localhost:3000) (Should show "Welcome to Pothole Detection API")
- **Python Health**: [http://localhost:8000](http://localhost:8000) (Should show "Pothole Detection Service Running")
