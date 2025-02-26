import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  // savedPhones adalah array dari nomor hp yang tersimpan
  const [savedPhones, setSavedPhones] = useState(user?.phones || []);
  // selectedPhoneOption: "new" atau salah satu nomor dari savedPhones
  const [selectedPhoneOption, setSelectedPhoneOption] = useState("new");
  // phoneInput: nilai input untuk nomor HP (baru atau edit nomor yang dipilih)
  const [phoneInput, setPhoneInput] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSavedPhones(user.phones || []);
      setSelectedPhoneOption("new");
      setPhoneInput(""); // default kosong untuk nomor baru
    }
  }, [user]);

  const handlePhoneOptionChange = (e) => {
    const val = e.target.value;
    setSelectedPhoneOption(val);
    if (val !== "new") {
      // Jika memilih nomor yang tersimpan, prefill input dengan nilai tersebut
      setPhoneInput(val);
    } else {
      setPhoneInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // Perbarui savedPhones: jika user sedang mengedit nomor yang sudah tersimpan,
      // ganti nomor tersebut dengan nilai phoneInput; jika opsi "new", tambahkan nomor baru.
      let updatedPhones = [...savedPhones];
      if (selectedPhoneOption !== "new") {
        updatedPhones = updatedPhones.map((p) =>
          p === selectedPhoneOption ? phoneInput : p
        );
      } else {
        // Tambahkan nomor baru jika belum ada dalam array
        if (phoneInput && !updatedPhones.includes(phoneInput)) {
          updatedPhones.push(phoneInput);
        }
      }

      const res = await axios.put(
        "https://jokidins-production.up.railway.app/api/user/profile",
        { name, email, phones: updatedPhones, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data;
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
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          className="w-full p-2 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Dropdown untuk pilih nomor HP yang tersimpan */}
        {savedPhones.length > 0 && (
          <select
            value={selectedPhoneOption}
            onChange={handlePhoneOptionChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="new">Input Nomor Baru</option>
            {savedPhones.map((p, idx) => (
              <option key={idx} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
        {/* Input untuk nomor HP */}
        <input
          type="text"
          placeholder="Nomor HP harus diawali 0"
          className="w-full p-2 border rounded-md"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password baru (kosongkan jika tidak ingin ubah)"
          className="w-full p-2 border rounded-md"
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
