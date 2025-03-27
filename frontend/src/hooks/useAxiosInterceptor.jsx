import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const currentPathname = useRef(window.location.pathname);
  const hasRedirected = useRef(false);

  const handleUnauthorized = useCallback(() => {
    if (
      !hasRedirected.current &&
      currentPathname.current !== "/login"
    ) {
      hasRedirected.current = true;

      // Use the logout method from AuthContext
      logout();

      setTimeout(() => {
        navigate("/login", { replace: true });
        hasRedirected.current = false;
      }, 2000);
    }
  }, [navigate, logout]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [handleUnauthorized]);

  return null;
};

export default useAxiosInterceptor;