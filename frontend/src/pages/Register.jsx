import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is user
  const [adminCode, setAdminCode] = useState(""); // For admin verification
  const [showAdminCode, setShowAdminCode] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
        adminCode: role === "admin" ? adminCode : undefined
      });
      
      const { token, user } = res.data;
      // Simpan token dan user ke localStorage dan context
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      alert("Registrasi berhasil!");
      // Redirect berdasarkan role
      navigate(user.role === "admin" ? "/admin/dashboard" : "/profile");
    } catch (error) {
      console.error("Register error:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Registrasi gagal. Cek data yang dimasukkan.");
      }
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setShowAdminCode(selectedRole === "admin");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama"
          className="w-full p-2 border rounded-md mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Konfirmasi Password"
          className="w-full p-2 border rounded-md mb-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <div className="mb-2">
          <select
            value={role}
            onChange={handleRoleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {showAdminCode && (
          <input
            type="password"
            placeholder="Kode Admin"
            className="w-full p-2 border rounded-md mb-2"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            required
          />
        )}

        <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition-colors duration-200">
          Daftar
        </button>
      </form>
    </div>
  );
};

export default Register;