import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AppFeedback() {
    console.log("AppFeedback loaded!");

    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/get_coping_mechanisms/");
                const data = await response.json();
                setFeedback(data.response);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="App">
            <h1>Feedback and Resources</h1>
            <div className="p-4 bg-gray-100 rounded-lg">
                <p>{feedback || "Loading feedback..."}</p>
            </div>
            <button onClick={() => navigate("/")} className="mt-4 bg-gray-500 text-white p-2 rounded">
                Back to Check-In
            </button>
        </div>
    );
}

export default AppFeedback;
