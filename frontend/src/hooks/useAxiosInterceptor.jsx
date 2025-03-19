// hooks/useAxiosInterceptor.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Cek apakah kita sudah di halaman login
          if (location.pathname !== "/login") {
            // Hapus token dan redirect
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate, location]);

  return null;
};

export default useAxiosInterceptor;
