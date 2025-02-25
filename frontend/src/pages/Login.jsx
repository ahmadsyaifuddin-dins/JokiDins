import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://jokidins-production.up.railway.app/api/auth/login", {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      alert("Login berhasil!");
      navigate(user.role === "admin" ? "/admin/dashboard" : "/profile");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login gagal. Cek kembali email dan password.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Form email & password */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-md mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md">
          Login
        </button>
      </form>

      <div className="my-4 text-center">atau</div>
      {/* Komponen Google Sign In */}
      <GoogleSignIn />
    </div>
  );
};

export default Login;
