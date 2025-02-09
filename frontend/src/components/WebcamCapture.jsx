import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onCapture }) => {
    const webcamRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const capture = async () => {
        setLoading(true);
        const imageSrc = webcamRef.current.getScreenshot();

        try {
            const response = await fetch("http://127.0.0.1:8000/detect_emotion/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageSrc }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            onCapture(data.emotions);
        } catch (error) {
            console.error("Error capturing emotion:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
            <button onClick={capture} disabled={loading}>
                {loading ? "Detecting..." : "Capture Emotion"}
            </button>
        </div>
    );
};

export default WebcamCapture;
