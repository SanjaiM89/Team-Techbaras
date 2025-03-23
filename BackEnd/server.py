import os
import cv2
import av
import shutil
import numpy as np
import uvicorn
import atexit
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from aiortc.contrib.media import MediaRecorder

from utils import get_mediapipe_pose
from process_frame import ProcessFrame
from thresholds import get_thresholds_beginner, get_thresholds_pro
from onboarding import onboarding_router
from auth_routes import auth_router
from workout import workout_router
from mealprep import router as mealprep_router  # Import the mealprep router

app = FastAPI()

# Set CORS based on environment
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")  
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to get difficulty thresholds
def get_thresholds(difficulty: str):
    return get_thresholds_pro() if difficulty == "pro" else get_thresholds_beginner()

# Initialize Pose Detection
pose = get_mediapipe_pose()

@app.websocket("/live-feed")
async def live_feed(websocket: WebSocket):
    """ Live WebSocket feed for real-time AI fitness tracking """
    await websocket.accept()
    print("WebSocket Connected!")

    try:
        try:
            difficulty = await websocket.receive_text()  # Receive difficulty setting
        except Exception:
            difficulty = "beginner"
        
        thresholds = get_thresholds(difficulty)
        live_process_frame = ProcessFrame(thresholds=thresholds, flip_frame=True)

        while True:
            data = await websocket.receive_bytes()
            nparr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                continue

            processed_frame, feedback = live_process_frame.process(frame, pose)

            _, buffer = cv2.imencode(".jpg", processed_frame)
            await websocket.send_bytes(buffer.tobytes())

    except WebSocketDisconnect:
        print("WebSocket Disconnected!")
    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        await websocket.close()
        print("WebSocket Closed")

@app.post("/upload-video/")
async def upload_video(file: UploadFile = File(...), difficulty: str = Query("beginner")):
    """ Process uploaded squat video for fitness tracking """

    # Save uploaded file
    save_path = Path(f"temp_videos/{file.filename}")
    save_path.parent.mkdir(parents=True, exist_ok=True)

    with save_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Open video with OpenCV
    cap = cv2.VideoCapture(str(save_path))
    if not cap.isOpened():
        return {"error": "Failed to open video"}

    thresholds = get_thresholds(difficulty)
    process_frame = ProcessFrame(thresholds)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        processed_frame, feedback = process_frame.process(frame, pose)

    cap.release()
    return {"message": "Video processed"}

# Cleanup function
def cleanup():
    global pose
    pose.close()
    print("Closed MediaPipe Pose model")

atexit.register(cleanup)

# Routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(onboarding_router, prefix="/onboarding", tags=["Onboarding"])
app.include_router(workout_router, prefix="/workouts", tags=["workouts"])
app.include_router(mealprep_router, prefix="/api")  # Mealprep routes under /api

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
