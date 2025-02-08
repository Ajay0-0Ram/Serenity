import React, { useState } from "react";

const TextAnalyzer = () => {
    const [text, setText] = useState("");
    const [emotion, setEmotion] = useState(null);
    
    const analyzeText = async () => {
        if (!text) return;

        try {
            const response = await fetch("http://127.0.0.1:8000/analyze_text/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();
            console.log("📌 API Response in React:", data); // Debugging output

            if (data && data.emotion) {
                setEmotion({
                    emotion: data.emotion || "Unknown",
                    confidence: data.confidence !== undefined ? data.confidence : null
                });
            } else {
                console.error("🚨 Error: Invalid response format", data);
                setEmotion({ emotion: "Error", confidence: null });
            }

        } catch (error) {
            console.error("🚨 Error analyzing text:", error);
        }
    };

    return (
        <div className="p-4">
            <textarea
                placeholder="Type something here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border p-2 w-full rounded-lg"
            />
            <button onClick={analyzeText} className="mt-2 bg-blue-500 text-white p-2 rounded">
                Analyze Text
            </button>

            {emotion && (
                <p className="mt-4 text-lg">
                    Detected Emotion: <strong>{emotion.emotion}</strong>
                    {emotion.confidence !== null 
                        ? ` (Confidence: ${emotion.confidence.toFixed(2)})`
                        : ""}
                </p>
            )}
        </div>
    );
};

export default TextAnalyzer;  // ✅ Make sure this is a default export
