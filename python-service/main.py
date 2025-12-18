from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import io
from PIL import Image
import os

app = FastAPI(title="Pothole Detection API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = None
MODEL_PATH = os.getenv("MODEL_PATH", "best.pt")

@app.on_event("startup")
async def load_model_on_startup():
    global model
    try:
        print(f"Loading model from {MODEL_PATH}...")
        model = YOLO(MODEL_PATH)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None

@app.get("/")
def health_check():
    return {
        "status": "ok", 
        "model_loaded": model is not None,
        "message": "Pothole Detection API is running"
    }

@app.get("/health")
def health():
    return {"status": "healthy" if model is not None else "unhealthy"}

@app.post("/detect")
async def detect_pothole(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Convert to numpy array (OpenCV format)
        img_np = np.array(image)
        
        # Run inference
        results = model(img_np, conf=0.25)  # Add confidence threshold
        
        # Process results
        detections = []
        max_severity = "LOW"
        detected = False
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                detected = True
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                xyxy = box.xyxy[0].tolist()
                
                # Calculate area for severity
                width = xyxy[2] - xyxy[0]
                height = xyxy[3] - xyxy[1]
                area = width * height
                image_area = img_np.shape[0] * img_np.shape[1]
                ratio = area / image_area
                
                severity = "LOW"
                if ratio > 0.05:
                    severity = "MEDIUM"
                if ratio > 0.2:
                    severity = "HIGH"
                
                # Update max severity
                severity_levels = {"LOW": 1, "MEDIUM": 2, "HIGH": 3}
                if severity_levels[severity] > severity_levels.get(max_severity, 0):
                    max_severity = severity

                detections.append({
                    "bbox": xyxy,
                    "confidence": round(conf, 3),
                    "class": cls,
                    "severity": severity,
                    "area_ratio": round(ratio, 4)
                })
        
        return {
            "pothole_detected": detected,
            "confidence": detections[0]["confidence"] if detections else 0.0,
            "severity": max_severity if detected else None,
            "num_detections": len(detections),
            "detections": detections
        }

    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)