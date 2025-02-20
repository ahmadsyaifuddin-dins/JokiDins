import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Jika user sudah update di context, pastikan form terisi
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data;
      // Update context dan localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile berhasil diupdate!");
      navigate("/profile");
    } catch (error) {
      console.error("Update profile error:", error);
      alert("Gagal update profile.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
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
           placeholder="Password baru (kosongkan jika tidak ingin ubah)"
           className="w-full p-2 border rounded-md mb-2"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />
         <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md">
           Update Profile
         </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
