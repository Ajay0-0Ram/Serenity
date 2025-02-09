import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "./components/WebcamCapture";
import TextAnalyzer from "./components/TextAnalyzer";
import EventLogger from "./components/EventLogger";

function AppCheckIn() {
    const [capturedEmotions, setCapturedEmotions] = useState([]);
    const [report, setReport] = useState("");
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCaptureEmotion = (emotions) => {
        setCapturedEmotions(emotions);
    };

    const handleReportChange = (newReport) => {
        setReport(newReport);
    };

    const handleLogEvent = (newEvent) => {
        setEvents([...events, newEvent]);
    };

    const handleSubmit = async () => {
        setError("");
        try {
            const response = await fetch("http://127.0.0.1:8000/check_in/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emotions: capturedEmotions,
                    report,
                    events,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            navigate("/feedback", { state: { feedback: data.response } });
        } catch (error) {
            setError("Failed to submit check-in. Please try again.");
        }
    };

    return (
        <div className="App">
            <h1>Check-In</h1>
            <WebcamCapture onCapture={handleCaptureEmotion} />
            <TextAnalyzer onReportChange={handleReportChange} />
            <EventLogger onLogEvent={handleLogEvent} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Submit Check-In
            </button>
        </div>
    );
}

export default AppCheckIn;
