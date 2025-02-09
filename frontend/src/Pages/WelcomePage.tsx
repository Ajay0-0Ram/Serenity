import styles from "./WelcomePage.module.css";
import Header from "../Components/Header";
import FadeIn from "../Components/FadeIn";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className={styles.container}>
      <FadeIn>
        <Header />
        <div className={styles.welcome}>
          <h1>Welcome to Serenity, your virtual mental health assistant.</h1>
        </div>
        <div className={styles.buttonContainer}>
          <Link to="/LoginPage">
            <button className={styles.button}>Log In</button>
          </Link>
          <Link to="/SignupPage">
            <button className={styles.button}>Sign Up</button>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
export default Welcome;
