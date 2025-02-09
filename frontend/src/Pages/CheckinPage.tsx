import WebcamCapture from "../Components/WebcamCapture";
import { TextAnalyzer } from "../Components/TextAnalyzer";
import EventLogger from "../Components/EventLogger";
import styles from "./CheckinPage.module.css";

function CheckinPage() {
  // Assuming you have a way to determine the emotion, for example, from WebcamCapture or TextAnalyzer
  const emotion = ""; // Replace this with the actual emotion value

  return (
    <div className={styles.checkinContainer}>
      <h1>Emotion Detection</h1>
      <div className={styles.checkinWebcam}>
        <WebcamCapture />
      </div>
      <div className={styles.checkinText}>
        <TextAnalyzer />
      </div>
      <div className={styles.checkinEmotion}>
        <EventLogger emotion={emotion} />
      </div>
    </div>
  );
}

export default CheckinPage;
