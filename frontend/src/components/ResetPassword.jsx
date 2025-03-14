import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useToast from "../hooks/useToast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (resetSuccess) return; // Skip verifikasi kalau password udah direset

    // Verifikasi token reset password
    const verifyToken = async () => {
      try {
        await axios.get(`https://jokidins-production.up.railway.app/api/auth/verify-reset-token/${token}`);
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        showError("Token tidak valid atau sudah kadaluwarsa");
      }
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, resetSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showError("Password tidak cocok");
      return;
    }

    if (password.length < 8) {
      showError("Password minimal 8 karakter");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`https://jokidins-production.up.railway.app/api/auth/reset-password/${token}`, {
        newPassword: password
      });
      
      setResetSuccess(true);
      showSuccess("Password berhasil diubah");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      showError(error.response?.data?.message || "Gagal mengubah password");
    } finally {
      setIsLoading(false);
    }
  };

  // Kalau password udah direset, tampilkan pesan sukses dan jangan cek token lagi
  if (resetSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Password Berhasil Diubah!</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-700">Memverifikasi token...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
          <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Tidak Valid</h2>
          <p className="text-gray-600 mb-6">Link reset password tidak valid atau sudah kadaluwarsa.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200"
          >
            Minta Link Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">Masukkan password baru Anda</p>
        </div>
        
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-2">Minimal 8 karakter</p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 text-white py-4 rounded-xl font-medium transition-all duration-200 transform hover:translate-y-[-2px] shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </div>
            ) : "Ubah Password"}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Kembali ke halaman login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
