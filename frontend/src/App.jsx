import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppCheckIn from "./AppCheckIn";
import AppFeedback from "./AppFeedback";

function App() {
    return (
        <Router>
            <h1>HELLO</h1>
            <Routes>
                <Route path="/" element={<AppCheckIn />} />
                <Route path="/feedback" element={<AppFeedback />} />
            </Routes>
        </Router>
    );
}

export default App;
