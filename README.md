# Pothole Detection and Navigation System

A full-stack application designed to detect potholes using AI, check severity, and route travelers through safe paths.

## 🚀 Features

-   **AI-Powered Detection**: Uses YOLOv8 (Deep Learning) to detect potholes from images.
-   **Intelligent Routing**: Calculates safe routes avoiding pothole-ridden roads.
-   **Crowdsourced Reporting**: Users can upload images of potholes to help others.
-   **Real-time Maps**: Visualizes potholes and routes on an interactive map.
-   **User Dashboard**: Track reported potholes and view safe routes.

## 🛠️ Tech Stack

### Frontend (Client)
-   **React.js**: UI Library
-   **Vite**: Build Tool
-   **Tailwind CSS**: Styling
-   **Leaflet / React-Leaflet**: Maps
-   **Axios**: API Requests

### Backend (Server)
-   **Node.js & Express**: API Server
-   **PostgreSQL & PostGIS**: Database with Geospatial support
-   **Multer**: File Uploads
-   **JWT**: Authentication

### AI Service (Microservice)
-   **Python**: Language
-   **FastAPI**: Web Framework
-   **YOLOv8n-seg (Ultralytics)**: Object Detection Model
-   **PyTorch**: Machine Learning Framework

## 📂 Project Structure

```
├── client/          # React Frontend
├── server/          # Node.js Backend API
├── python-service/  # Python AI Microservice
├── db_schema.sql    # Database Schema
```

## 🏁 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Python (v3.9+)
-   PostgreSQL (Local or Cloud like Supabase)
-   Git

### Installation & Running Locally

Please ensure you have set up your `.env` files in `server` and `client` directories.

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd pothole-detection-system
    ```

2.  **Start the Database**
    Ensure PostgreSQL is running and execute `db_schema.sql`.

3.  **Start Python Service**
    ```bash
    cd python-service
    pip install -r requirements.txt
    ./start.sh # or uvicorn main:app --reload
    ```

4.  **Start Backend Server**
    ```bash
    cd server
    npm install
    npm run dev
    ```

5.  **Start Client**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## 📖 Guides

-   [**Deployment Guide**](./DEPLOYMENT_GUIDE.md) - Instructions for deploying to Render, Vercel, and Supabase.
-   [**Running Guide**](./RUNNING_GUIDE.md) - Detailed steps for running the project locally.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
