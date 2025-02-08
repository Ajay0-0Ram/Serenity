import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    if (!isWebcamOn) return; // Prevent capturing when webcam is off
  
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
  
    // Convert base64 to Blob
    const byteString = atob(imageSrc.split(",")[1]);
    const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    const file = new Blob([arrayBuffer], { type: mimeString });
  
    // Prepare FormData for API request
    const formData = new FormData();
    formData.append("file", file, "snapshot.jpg");
  
    try {
      const response = await fetch("http://127.0.0.1:8000/detect_emotion/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setEmotion(data);
    } catch (error) {
      console.error("Error detecting emotion:", error);
    }
    setLoading(false);
  };
  

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Webcam turns on/off based on state */}
      {isWebcamOn && (
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-lg shadow-lg" />
      )}

      {/* Buttons to Capture & Toggle Webcam */}
      <div className="flex gap-2">
        <button onClick={capture} disabled={loading || !isWebcamOn}>
          {loading ? "Detecting..." : "Capture & Detect Emotion"}
        </button>
        <button onClick={() => setIsWebcamOn(!isWebcamOn)}>
          {isWebcamOn ? "Turn Off Webcam" : "Turn On Webcam"}
        </button>
      </div>

      {/* Display Detected Emotion */}
      {emotion && (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold">Detected Emotion:</h2>
          <p className="text-lg">{emotion.emotion} (Confidence: {emotion.confidence.toFixed(2)})</p>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
