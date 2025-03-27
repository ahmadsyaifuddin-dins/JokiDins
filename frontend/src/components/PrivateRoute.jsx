import { Navigate } from "react-router-dom";
import { decodeJwt } from "../utils/decodeJwt";
import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const { logout } = useContext(AuthContext);
  const [isTokenValid, setIsTokenValid] = useState(true);

  // Memoize the token check to prevent unnecessary rerenders
  const tokenValidity = useMemo(() => {
    if (token) {
      const decodedToken = decodeJwt(token);
      return decodedToken && decodedToken.exp * 1000 > Date.now();
    }
    return false;
  }, [token]);

  useEffect(() => {
    if (token && !tokenValidity) {
      setIsTokenValid(false);
      logout();
    }
  }, [token, tokenValidity, logout]);

  if (!token || !isTokenValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;