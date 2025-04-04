import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import useToast from "../hooks/useToastCustomize";
import { API_BASE_URL } from '../config';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin/dashboard" : "/profile");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      // Kalau error response menandakan akun belum diverifikasi,
      // simpan email pending dan redirect ke halaman verifikasi
      if (error.response?.data?.verificationRequired) {
        localStorage.setItem("pendingEmail", error.response.data.email);
        showError(error.response.data.message);
        setTimeout(() => {
          navigate("/verify");
        }, 1500);
      } else {
        showError(error.response?.data?.message || "Login gagal. Cek kembali email dan password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 p-4">      
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-900 py-4 px-6">
          <h2 className="text-2xl font-bold text-white text-center">Selamat Datang</h2>
          <p className="text-blue-100 text-center mt-1">Silakan login untuk melanjutkan</p>
        </div>
      
        <div className="mt-6">
          <GoogleSignIn />
        </div>
        
        <div className="relative flex items-center justify-center mt-6">
          <div className="border-t border-gray-300 absolute w-full"></div>
          <div className="bg-white px-4 relative text-sm text-gray-500">atau</div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <FaEnvelope />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <FaLock />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center opacity-50 cursor-not-allowed">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded cursor-not-allowed"
                  disabled
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-not-allowed">
                  Ingat saya
                </label>
              </div>
              
              <Link to="/forgot-password" className="text-sm">
                <span className="font-medium text-blue-900 hover:text-blue-950">
                  Lupa password?
                </span>
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link to="/register" className="font-medium text-blue-900 hover:text-blue-950">
              Daftar disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
