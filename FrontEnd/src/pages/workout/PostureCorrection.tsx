import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostureCorrection: React.FC = () => {
    const [view, setView] = useState<"live" | "upload">("live");
    const [difficulty, setDifficulty] = useState<"beginner" | "pro">("beginner");
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (view === "live") {
            ws.current = new WebSocket("ws://localhost:8000/live-feed");

            ws.current.onopen = () => {
                console.log("WebSocket Connected!");
                ws.current?.send(difficulty);  // Send difficulty setting
            };

            ws.current.onmessage = async (event) => {
                try {
                    if (event.data instanceof Blob) {
                        // Convert received Blob (image) to an Object URL
                        const blob = event.data;
                        const imageUrl = URL.createObjectURL(blob);
                        setImageSrc(imageUrl); // Update state to display image
                    } else {
                        console.log("Received WebSocket message:", event.data);
                    }
                } catch (error) {
                    console.error("Error handling WebSocket message:", error);
                }
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket Error:", error);
            };

            ws.current.onclose = () => {
                console.log("WebSocket Disconnected!");
            };

            const sendFrame = () => {
                if (videoRef.current && canvasRef.current) {
                    const ctx = canvasRef.current.getContext("2d");
                    const video = videoRef.current;

                    if (ctx) {
                        canvasRef.current.width = video.videoWidth;
                        canvasRef.current.height = video.videoHeight;
                        ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);

                        canvasRef.current.toBlob((blob) => {
                            if (blob && ws.current?.readyState === WebSocket.OPEN) {
                                ws.current.send(blob);
                            }
                        }, "image/jpeg");
                    }
                }
                setTimeout(sendFrame, 100); // Send frame every 100ms
            };

            const startStreaming = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                        sendFrame();
                    }
                } catch (error) {
                    console.error("Error accessing webcam:", error);
                }
            };

            startStreaming();

            return () => {
                ws.current?.close();
                if (videoRef.current?.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach((track) => track.stop());
                }
            };
        }
    }, [view, difficulty]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await axios.post(`http://localhost:8000/upload-video/?difficulty=${difficulty}`, formData);
                alert(`Result: ${JSON.stringify(response.data.result)}`);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Posture Correction</h1>
            


            <label className="mb-2">Select Difficulty: </label>
            <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as "beginner" | "pro")}
                className="w-full bg-dark-lighter border-primary text-white py-2 px-3 rounded-lg mt-2 mb-4"
            >
                <option value="beginner">Beginner</option>
                <option value="pro">Pro</option>
            </select>


            {view === "live" && (
                <div className="flex flex-col items-center">
                    <video ref={videoRef} autoPlay playsInline width="1" height="480"
                        className="border-2 border-black mb-4"
                    />
                    <canvas ref={canvasRef} hidden />
                    
                    {/* Render the processed image received from WebSocket */}
                    {imageSrc && (
                        <img src={imageSrc} alt="Processed Frame" width="640" height="480" className="border-2 border-black mb-4" />
                    )}

                    <p><strong></strong> {feedback || ""}</p>
                </div>
            )}

            {view === "upload" && (
                <div>
                    <input type="file" accept="video/*" onChange={handleFileUpload} className="border p-2" />
                </div>
            )}

            <button className="w-full bg-primary text-dark py-3 mt-4 rounded-lg font-semibold flex items-center justify-center" onClick={() => navigate(-1)}>
            Return to Workout
            </button>
        </div>
    );
};

export default PostureCorrection;
