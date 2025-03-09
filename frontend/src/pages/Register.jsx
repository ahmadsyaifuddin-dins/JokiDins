import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import GoogleSignIn from "../components/GoogleSignIn";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Custom toast styles
  const toastStyles = {
    success: {
      style: {
        background: '#4ade80',
        color: '#fff',
        padding: '16px',
        borderRadius: '10px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#4ade80',
      },
      duration: 3000,
    },
    error: {
      style: {
        background: '#f87171',
        color: '#fff',
        padding: '16px',
        borderRadius: '10px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#f87171',
      },
      duration: 4000,
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok", toastStyles.error);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post("https://jokidins-production.up.railway.app/api/auth/register", {
        name,
        email,
        password,
        role: "user" // Role selalu dianggap sebagai "user"
      });
      
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      toast.success("Registrasi berhasil!", toastStyles.success);
      
      // Delay navigation to allow toast to be seen
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, toastStyles.error);
      } else {
        toast.error("Registrasi gagal. Cek data yang dimasukkan.", toastStyles.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 p-4">
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-900 py-6 px-6">
          <h2 className="text-2xl font-bold text-white text-center">Buat Akun Baru</h2>
          <p className="text-indigo-100 text-center mt-1">Silakan isi data diri Anda</p>
        </div>

          <div className="mt-6">
            <GoogleSignIn />
          </div>
          
        <div className="relative flex items-center justify-center mt-6">
            <div className="border-t border-gray-300 absolute w-full"></div>
            <div className="bg-white px-4 relative text-sm text-gray-500">atau daftar secara manual</div>
          </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <FaUser />
              </div>
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
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
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <FaLock />
              </div>
              <input
                type="password"
                placeholder="Konfirmasi Password"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <FaUserPlus />
                    <span>Daftar</span>
                  </>
                )}
              </button>
            </div>
          </form>
                    
          <p className="mt-8 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-medium text-blue-900 hover:text-blue-950">
              Login disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;