// src/utils/axiosInterceptor.js
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Kalo error 401, artinya token udah expired/invalid
        if (error.response && error.response.status === 401) {
          // Hapus token dari penyimpanan, misal localStorage
          localStorage.removeItem("token");
          // Redirect ke halaman login
          navigate("/login");
          // Opsional: refresh halaman supaya state global ikut reset
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);
};

export default useAxiosInterceptor;
