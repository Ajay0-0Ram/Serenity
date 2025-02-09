import React from "react";

const TextAnalyzer = ({ onReportChange }) => {
    return (
        <div className="p-4">
            <textarea
                placeholder="Type your report here..."
                onChange={(e) => onReportChange(e.target.value)}
                className="border p-2 w-full rounded-lg"
            />
        </div>
    );
};

export default TextAnalyzer;
