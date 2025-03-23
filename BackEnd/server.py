import os
import cv2
import av
import numpy as np
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from aiortc.contrib.media import MediaRecorder

from utils import get_mediapipe_pose
from process_frame import ProcessFrame
from thresholds import get_thresholds_beginner, get_thresholds_pro

app = FastAPI()

# Enable CORS for WebSocket
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
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
        difficulty = await websocket.receive_text()  # Receive difficulty setting
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
    contents = await file.read()
    
    if not contents:
        return {"error": "Empty file received"}

    nparr = np.frombuffer(contents, np.uint8)
    video = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if video is None:
        return {"error": "Failed to decode video"}

    thresholds = get_thresholds(difficulty)
    process_frame = ProcessFrame(thresholds)
    
    result = process_frame.process(video, pose)

    return {"message": "Video processed", "result": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
