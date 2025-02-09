import React from "react";
import WebcamCapture from "./components/WebcamCapture";
import { TextAnalyzer } from "./components/TextAnalyzer";
import EventLogger from "./components/EventLogger";

const App: React.FC = () => {
  // Assuming you have a way to determine the emotion, for example, from WebcamCapture or TextAnalyzer
  const emotion = ""; // Replace this with the actual emotion value

  return (
    <div className="App">
      <h1>Emotion Detection</h1>
      <WebcamCapture />
      <TextAnalyzer />
      <EventLogger emotion={emotion} />
    </div>
  );
};

export default App;