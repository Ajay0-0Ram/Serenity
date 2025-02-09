import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import FadeIn from "../Components/FadeIn";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Navigate to the check-in page on successful login
        navigate("/CheckinPage");
      } else {
        const data = await response.json();
        setError(data.detail || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.backgroundImage}>
      <FadeIn>
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <h1>Enter Login Details</h1>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
          <div className={styles.signupBox}>
            <h4>
              Don't have an account?{" "}
              <Link to="/SignupPage">Sign Up Here</Link>
            </h4>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export default LoginPage;
