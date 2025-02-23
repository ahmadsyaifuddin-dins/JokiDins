import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GoogleSignIn = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Kirim ID token ke backend
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
        // birthday: null, // commented out
        // gender: null,   // commented out
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      alert("Login dengan Google berhasil!");
      navigate(user.role === "admin" ? "/admin/dashboard" : "/profile");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Login dengan Google gagal.");
    }
  };

  const handleError = () => {
    console.log("Google Sign In Error");
    alert("Google Sign In Error");
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin 
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default GoogleSignIn;
