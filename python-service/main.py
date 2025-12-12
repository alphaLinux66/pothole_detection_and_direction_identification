from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2
import numpy as np
import io
from PIL import Image

app = FastAPI()

# Load model
try:
    model = YOLO("best.pt")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.get("/")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/detect")
async def detect_pothole(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to numpy array (OpenCV format)
        img_np = np.array(image)
        
        # Run inference
        results = model(img_np)
        
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
                
                # Calculate area for severity (simplified logic)
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
                    "confidence": conf,
                    "severity": severity
                })
        
        return {
            "pothole_detected": detected,
            "confidence": detections[0]["confidence"] if detections else 0.0,
            "severity": max_severity if detected else None,
            "detections": detections
        }

    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
