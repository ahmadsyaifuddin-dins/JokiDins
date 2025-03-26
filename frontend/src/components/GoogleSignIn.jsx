import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';

const GoogleSignIn = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleSuccess = async (credentialResponse) => {
    let loadingToast = null;
    try {
      // Show loading toast
      loadingToast = toast.loading("Menghubungkan dengan Google...");
      
      // Kirim ID token ke backend
      const res = await axios.post("https://jokidins-production.up.railway.app/api/auth/google", {
        token: credentialResponse.credential,
      });
      
      toast.dismiss(loadingToast);
      
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      toast.success("Login dengan Google berhasil!", toastStyles.success);
      
      // Delay navigation to allow toast to be seen
      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin/dashboard" : "/profile");
      }, 1000);
    } catch (error) {
      if (loadingToast) toast.dismiss(loadingToast);
      console.error("Google login error:", error);
      
      // Kalau backend mengembalikan pesan spesifik (misal akun nonaktif), tampilkan pesan itu
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, toastStyles.error);
      } else {
        toast.error("Login dengan Google gagal.", toastStyles.error);
      }
    }
  };

  const handleError = () => {
    console.log("Google Sign In Error");
    toast.error("Gagal terhubung dengan Google", toastStyles.error);
  };

  // Custom button to trigger Google login
  const CustomGoogleButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      <FcGoogle className="text-xl" />
      <span className="font-medium">Lanjutkan dengan Google</span>
    </button>
  );

  return (
    <div className="w-full flex justify-center items-center ">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        shape="rectangular"
        theme="outline"
        text="continue_with"
        locale="id_ID"
        render={({ onClick }) => <CustomGoogleButton onClick={onClick} />}
      />
    </div>
  );
};

export default GoogleSignIn;
