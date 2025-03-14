import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useToast from "../hooks/useToast";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 menit dalam detik
  const [resendDisabled, setResendDisabled] = useState(true);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Ambil email pending dari localStorage
  const email = localStorage.getItem("pendingEmail");

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
    
    // Cek apakah ada timer yang tersimpan
    const savedExpiry = localStorage.getItem("verificationExpiry");
    if (savedExpiry) {
      const expiryTime = parseInt(savedExpiry);
      const now = new Date().getTime();
      const difference = expiryTime - now;
      
      if (difference > 0) {
        // Masih ada waktu tersisa
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        // Timer sudah habis
        setTimeLeft(0);
        setResendDisabled(false);
        localStorage.removeItem("verificationExpiry");
      }
    }
  }, [email, navigate]);

  // Timer untuk kode verifikasi
  useEffect(() => {
    if (timeLeft <= 0) {
      setResendDisabled(false);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format waktu ke mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("https://jokidins-production.up.railway.app/api/auth/verify-email", {
        email,
        verificationCode,
      });
      const { token, user, message } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Bersihkan pending email dan timer jika sudah diverifikasi
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("verificationExpiry");
      showSuccess(message);
      navigate("/profile");
    } catch (error) {
      console.error("Verification error:", error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
        
        // Jika kode kedaluwarsa, aktifkan tombol resend
        if (error.response.data.expired) {
          setTimeLeft(0);
          setResendDisabled(false);
          localStorage.removeItem("verificationExpiry");
        }
      } else {
        showError("Verifikasi gagal. Cek kode yang dimasukkan.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await axios.post("https://jokidins-production.up.railway.app/api/auth/resend-verification", { email });
      
      // Reset timer dan simpan waktu kedaluwarsa baru
      setTimeLeft(300);
      setResendDisabled(true);
      const expiryTime = new Date().getTime() + (300 * 1000); // 5 menit
      localStorage.setItem("verificationExpiry", expiryTime.toString());
      
      showSuccess("Kode verifikasi baru telah dikirim ke email Anda");
    } catch (error) {
      console.error("Resend error:", error);
      showError(error.response?.data?.message || "Gagal mengirim ulang kode verifikasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-900 p-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Verifikasi Email</h2>
          <p className="text-blue-100 text-center mt-2">
            Kami telah mengirimkan kode verifikasi ke email Anda
          </p>
        </div>
        
        <div className="p-8">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 font-medium">
              Email: <span className="font-bold">{email || "Tidak ditemukan"}</span>
            </p>
          </div>
          
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-1">
                Masukkan Kode Verifikasi
              </label>
              <div className="relative">
                <input
                  id="verification-code"
                  type="text"
                  placeholder="Masukkan kode 6 digit"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
                {timeLeft > 0 && (
                  <div className="absolute right-3 top-4 bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium">
                    {formatTime(timeLeft)}
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-950 text-white py-4 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </span>
              ) : (
                "Verifikasi"
              )}
            </button>
            
            <div className="text-center">
              {!resendDisabled ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-blue-900 hover:text-blue-700 font-medium text-sm"
                >
                  Kirim Ulang Kode Verifikasi
                </button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Belum menerima kode? Tunggu {formatTime(timeLeft)}
                </p>
              )}
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-blue-900 text-sm font-medium"
            >
              Kembali ke Halaman Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;