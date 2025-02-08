import React from "react";
import WebcamCapture from "./components/WebcamCapture";
import TextAnalyzer from "./components/TextAnalyzer";

function App() {
  return (
    <div className="App">
      <h1>Emotion Detection</h1>
      <WebcamCapture />
      <TextAnalyzer />
    </div>
  );
}

export default App;
