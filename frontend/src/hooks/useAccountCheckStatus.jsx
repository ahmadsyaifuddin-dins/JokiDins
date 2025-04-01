import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from '../config';

const useAccountStatusCheck = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API_BASE_URL}/api/user/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Misalnya res.data.is_active adalah boolean status
        if (!res.data.is_active) {
          logout();
          navigate("/login");
        }
      } catch (error) {
        console.error("Status check error:", error);
      }
    }, 10000); // cek setiap 10 detik

    return () => clearInterval(interval);
  }, [logout, navigate]);
};

export default useAccountStatusCheck;
