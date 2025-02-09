import React, { useState } from "react";
import styles from "./SignupPage.module.css";
import FadeIn from "../Components/FadeIn";
import { useNavigate, Link } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSignup = async () => {
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        navigate("/LoginPage");
      } else {
        const data = await response.json();
        setError(data.detail || "Registration failed.");
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      setError("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className={styles.backgroundImage}>
      <FadeIn>
        <div className={styles.signupContainer}>
          <div className={styles.signupBox}>
            <h1>Create an Account</h1>
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
            <button onClick={handleSignup}>Sign Up</button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
          <div className={styles.loginBox}>
            <h4>
              Already have an account?{" "}
              <Link to="/LoginPage">Log In Here</Link>
            </h4>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export default SignupPage;
