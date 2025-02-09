import React, { useState } from "react";
import Webcam from "react-webcam";

export const WebcamCapture = () => {
    const [emotions, setEmotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const webcamRef = React.useRef(null);

    const captureAndSend = async () => {
        setLoading(true);
        setEmotions([]);
        setError("");

        try {
            // Capture 5 pictures
            const images = [];
            for (let i = 0; i < 5; i++) {
                const imageSrc = webcamRef.current.getScreenshot();
                images.push(imageSrc);
                await new Promise((resolve) => setTimeout(resolve, 500));  // Delay between captures
            }

            // Send the images to the backend
            const response = await fetch("http://127.0.0.1:8000/detect_multiple_emotions/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ images }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch emotions");
            }

            const data = await response.json();
            setEmotions(data.emotions);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
            />

            <button onClick={captureAndSend} disabled={loading}>
                {loading ? "Detecting Emotions..." : "Capture and Detect"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div>
                <h2>Detected Emotions:</h2>
                {emotions.length > 0 ? (
                    <ul>
                        {emotions.map((emotion, index) => (
                            <li key={index}>{emotion}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No emotions detected yet.</p>
                )}
            </div>
        </div>
    );
};
