import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppCheckIn from "./AppCheckIn";
import AppFeedback from "./AppFeedback";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppCheckIn />} />
                <Route path="/feedback" element={<AppFeedback />} />
                <Route path="*" element={<h1>Page Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
