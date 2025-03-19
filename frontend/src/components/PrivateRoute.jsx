// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { decodeJwt } from "../utils/decodeJwt";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const { logout } = useContext(AuthContext);

  // Kalau token nggak ada, langsung redirect ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decodedToken = decodeJwt(token);

  // Jika token gagal di-decode atau sudah expired
  if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
    // Panggil logout untuk update state AuthContext (hapus user)
    logout();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
