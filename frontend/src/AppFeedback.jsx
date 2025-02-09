import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AppFeedback() {
    const location = useLocation();
    const navigate = useNavigate();

    const feedback = location.state?.feedback || "No feedback available.";

    return (
        <div className="App">
            <h1>Feedback and Resources</h1>
            <div className="p-4 bg-gray-100 rounded-lg">
                <p>{feedback}</p>
            </div>
            <button onClick={() => navigate("/")} className="mt-4 bg-gray-500 text-white p-2 rounded">
                Back to Check-In
            </button>
        </div>
    );
}

export default AppFeedback;
