import React from "react";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "./components/WebcamCapture";
import TextAnalyzer from "./components/TextAnalyzer";
import EventLogger from "./components/EventLogger";

function AppCheckIn() {
    console.log("AppCheckIn loaded!");

    const navigate = useNavigate();

    const handleSubmit = () => {
        // Perform your API submission logic here
        console.log("Submitting check-in data...");
        
        // Navigate to the feedback page after submission
        navigate("/feedback");
    };

    return (
        <div className="App">
            <h1>Check-In</h1>
            <WebcamCapture />
            <TextAnalyzer />
            <EventLogger />
            <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Submit Check-In
            </button>
        </div>
    );
}

export default AppCheckIn;
