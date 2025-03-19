// hooks/AutoLogoutWrapper.jsx
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { decodeJwt } from "../utils/decodeJwt";

const convertMsToTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  return `${hours} hour${hours !== 1 ? "s" : ""}, ${minutes} minute${minutes !== 1 ? "s" : ""}, ${seconds} second${seconds !== 1 ? "s" : ""}`;
};

const AutoLogoutWrapper = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeJwt(token);
      if (!decodedToken) return;
      const expiryTime = decodedToken.exp * 1000;
      const timeLeft = expiryTime - Date.now();
      console.log("Time left:", convertMsToTime(timeLeft));
      if (timeLeft <= 0) {
        console.log("Token expired, auto logout");
        logout();
        navigate("/login");
      } else {
        const timer = setTimeout(() => {
          console.log("Timer expired, auto logout");
          logout();
          navigate("/login");
        }, timeLeft);
        return () => clearTimeout(timer);
      }
    }
  }, [navigate, logout]);

  return null;
};

export default AutoLogoutWrapper;
