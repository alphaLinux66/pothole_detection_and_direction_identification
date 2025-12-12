# Project Startup Guide

Use this guide to start the "Pothole Detection System" from a fresh state (e.g., after restarting your computer or closing your IDE).

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (v14 or higher) with **PostGIS** extension

---

## Startup Guide
Follow this exact order to start the system. You will need **4 separate terminal windows**.

### Terminal 1: Database
*You must have a PostgreSQL + PostGIS instance running.*
Ensure your local PostgreSQL service is started and you have a database created.

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
