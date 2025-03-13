import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GoogleSignIn = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Fetch data dari People API (gender, birthday)
  const fetchPeopleAPIData = async (accessToken) => {
    try {
      const response = await fetch(
        "https://people.googleapis.com/v1/people/me?personFields=birthdays,genders",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Gagal ambil data People API:", error);
      return null;
    }
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      // Ini ID token Google
      const idToken = credentialResponse.credential;

      // 2. Minta scope tambahan untuk dapat access token
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read",
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            // 3. Panggil People API untuk ambil data gender & birthday
            const additionalData = await fetchPeopleAPIData(tokenResponse.access_token);
            const birthday = additionalData?.birthdays?.[0]?.date;
            const gender = additionalData?.genders?.[0]?.value;

            // 4. Kirim ID token + data tambahan ke backend
            const res = await axios.post("https://jokidins-production.up.railway.app/api/auth/google", {
              token: idToken,
              birthday,
              gender
            });
            const { token, user } = res.data;

            // Simpan & redirect
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            alert("Login dengan Google berhasil!");
            navigate(user.role === "admin" ? "/admin/dashboard" : "/profile");
          }
        },
      });

      // Minta access token
      tokenClient.requestAccessToken();
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
