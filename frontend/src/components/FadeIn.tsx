import { useEffect, useState } from "react";
import styles from "./FadeIn.module.css"; // Import the CSS file

interface FadeInProps {
  children: React.ReactNode;
  delay?: number; // Optional delay in milliseconds
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timeout); // Cleanup timeout
  }, [delay]);

  return (
    <div className={`${styles.fadeIn} ${isVisible ? styles.show : ""}`}>
      {children}
    </div>
  );
};

export default FadeIn;
