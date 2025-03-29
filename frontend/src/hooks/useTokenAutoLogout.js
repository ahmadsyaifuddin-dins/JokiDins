// hooks/useTokenAutoLogout.js
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { decodeJwt } from "../utils/decodeJwt";

const useTokenAutoLogout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Ambil token sekali saja
    const token = localStorage.getItem("token");
    if (!token) return;

    // 2. Decode token untuk cek expiry
    const decoded = decodeJwt(token);
    if (!decoded) return; // kalau gagal decode, anggap saja invalid

    const expiryTime = decoded.exp * 1000; // convert ke ms
    const now = Date.now();

    // 3. Kalau sudah expired, langsung logout & redirect
    if (expiryTime <= now) {
      logout();
      navigate("/login");
      return;
    }

    // 4. Hitung sisa waktu
    const timeLeft = expiryTime - now;

    // 5. Set timer untuk logout
    const timer = setTimeout(() => {
      logout();
      navigate("/login");
    }, timeLeft);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, [logout, navigate]);
};

export default useTokenAutoLogout;
