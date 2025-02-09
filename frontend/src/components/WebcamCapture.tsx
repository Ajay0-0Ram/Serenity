import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import styles from "./WebcamCapture.module.css"; // Importing CSS Modules

interface EmotionResponse {
  emotion: string;
  confidence: string;
}

const WebcamCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [emotion, setEmotion] = useState<EmotionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [webcamReady, setWebcamReady] = useState<boolean>(false);
  const [webcamActive, setWebcamActive] = useState<boolean>(true);

  useEffect(() => {
    if (webcamRef.current) {
      setWebcamReady(true);
    }
  }, []);

  const capture = async () => {
    if (!webcamRef.current || !webcamReady || !webcamActive) {
      console.error("❌ Webcam is not ready or inactive.");
      return;
    }

    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      console.error("❌ Error: No image captured.");
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

    // Send image to API
    const formData = new FormData();
    formData.append("file", blob, "snapshot.jpg");

    try {
      const response = await fetch("http://127.0.0.1:8000/detect_emotion/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("📌 API Response:", data);

      setEmotion({
        emotion: data.emotion || "Unknown",
        confidence:
          data.confidence !== undefined ? data.confidence.toFixed(2) : "N/A",
      });
    } catch (error) {
      console.error("Error detecting emotion:", error);
    }
    setLoading(false);
  };

  const toggleWebcam = () => {
    if (webcamActive && webcamRef.current?.video?.srcObject) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (webcamRef.current?.video) {
            webcamRef.current.video.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error restarting webcam:", error);
        });
    }
    setWebcamActive(!webcamActive);
  };

  return (
    <div className={styles.containerWebcam}>
      {webcamActive && (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          onUserMedia={() => setWebcamReady(true)}
          className={styles.webcamBox}
        />
      )}

      <div className="d-flex gap-2">
        <button
          onClick={capture}
          disabled={loading || !webcamReady || !webcamActive}
          className={styles.btnPrimaryCustom}
        >
          {loading ? "Detecting..." : "Capture & Detect Emotion"}
        </button>

        <button
          onClick={toggleWebcam}
          className={`${
            webcamActive ? styles.btnDangerCustom : styles.btnSuccessCustom
          }`}
        >
          {webcamActive ? "Turn Off Webcam" : "Turn On Webcam"}
        </button>
      </div>

      {emotion && (
        <div className={styles.emotionBox}>
          <h2 className="h4">Detected Emotion:</h2>
          <p className="h5">
            {emotion.emotion} (Confidence: {emotion.confidence})
          </p>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
