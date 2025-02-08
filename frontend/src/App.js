import React from "react";
import WebcamCapture from "./components/WebcamCapture";
import TextAnalyzer from "./components/TextAnalyzer";
import EventLogger from "./components/EventLogger";

function App() {
  return (
    <div className="App">
      <h1>Emotion Detection</h1>
      <WebcamCapture />
      <TextAnalyzer />
      <EventLogger />
    </div>
  );
}

export default App;
