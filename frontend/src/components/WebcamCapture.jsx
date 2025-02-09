import React, { useRef, useState } from "react";
import Webcam from "react-webcam";


const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    if (!isWebcamOn) return;
  
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
  
    if (!imageSrc) {
      console.error("Error: No image captured.");
      setLoading(false);
      return;
    }
  
    // Convert base64 to Blob
    const byteCharacters = atob(imageSrc.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
  
    // Prepare FormData
    const formData = new FormData();
    formData.append("file", blob, "snapshot.jpg");
  
    try {
      const response = await fetch("http://127.0.0.1:8000/detect_emotion/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("API Response:", data);  // Log full response to debug
      setEmotion(data);
    } catch (error) {
      console.error( "Error detecting emotion:", error);
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
