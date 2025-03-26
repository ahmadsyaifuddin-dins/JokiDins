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
        // Kalau respon error 401 (Unauthorized) atau 403 (Forbidden: bisa karena akun nonaktif)
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // Kalau kita udah di halaman login, gak usah redirect lagi
          if (location.pathname !== "/login") {
            // Hapus token dan redirect
            localStorage.removeItem("token");
            localStorage.removeItem("user");
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
