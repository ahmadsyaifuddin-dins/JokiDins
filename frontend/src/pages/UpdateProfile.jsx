import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Lock, Save, Trash, Edit, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savedPhones, setSavedPhones] = useState(user?.phones || []);
  const [selectedPhoneOption, setSelectedPhoneOption] = useState("new");
  const [phoneInput, setPhoneInput] = useState("");
  const [password, setPassword] = useState("");
  // State baru untuk tanggal lahir dan gender
  const [birthday, setBirthday] = useState(user?.birthday || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneListOpen, setIsPhoneListOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSavedPhones(user.phones || []);
      setSelectedPhoneOption("new");
      setPhoneInput("");
      if (user.birthday) {
        // Format ke YYYY-MM-DD
        const formattedBirthday = new Date(user.birthday)
          .toISOString()
          .substring(0, 10);
        setBirthday(formattedBirthday);
      } else {
        setBirthday("");
      }
      setGender(user.gender || "");
    }
  }, [user]);
  

  const handlePhoneOptionChange = (e) => {
    const val = e.target.value;
    setSelectedPhoneOption(val);
    if (val !== "new") {
      setPhoneInput(val);
    } else {
      setPhoneInput("");
    }
  };

  const handleRemovePhone = async (phoneToRemove) => {
    try {
      setIsDeleting(true);
      
      const updatedPhones = savedPhones.filter(p => p !== phoneToRemove);
      setSavedPhones(updatedPhones);
      
      if (selectedPhoneOption === phoneToRemove) {
        setSelectedPhoneOption("new");
        setPhoneInput("");
      }
      
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "https://jokidins-production.up.railway.app/api/user/profile",
        { phones: updatedPhones },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = res.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success("Nomor telepon berhasil dihapus!");
    } catch (error) {
      console.error("Error removing phone:", error);
      toast.error("Gagal menghapus nomor telepon.");
      setSavedPhones(user?.phones || []);
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePhoneList = () => {
    setIsPhoneListOpen(!isPhoneListOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      let updatedPhones = [...savedPhones];
      
      if (selectedPhoneOption !== "new") {
        updatedPhones = updatedPhones.map((p) =>
          p === selectedPhoneOption ? phoneInput : p
        );
      } else {
        if (phoneInput && !updatedPhones.includes(phoneInput)) {
          updatedPhones.push(phoneInput);
        }
      }

      // Sertakan birthday dan gender di payload
      const res = await axios.put(
        "https://jokidins-production.up.railway.app/api/user/profile",
        { name, email, phones: updatedPhones, password, birthday, gender },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = res.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success("Profile berhasil diupdate!");
      
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Gagal update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center text-white opacity-90 hover:opacity-100 mb-6 transition-all group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Profile</span>
          </button>
          <h2 className="text-2xl font-bold text-white">Update Profile</h2>
          <p className="text-blue-100 mt-1">Perbarui informasi akun Anda</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-600" />
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-600" />
              Email
            </label>
            <input
              type="email"
              placeholder="Masukkan email"
              className="w-full p-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={email}
              readOnly
              required
            />
          </div>
          
          {/* Tambahan Field untuk Tanggal Lahir */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tanggal Lahir
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>

          {/* Tambahan Field untuk Gender */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Jenis Kelamin
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          
          {/* Phone Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                Nomor Telepon
              </label>
              {selectedPhoneOption === "new" ? (
                <span className="text-xs text-blue-600 flex items-center">
                  Tambah baru
                </span>
              ) : (
                <span className="text-xs text-blue-600 flex items-center">
                  Edit nomor
                </span>
              )}
            </div>
            
            {savedPhones.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={togglePhoneList}
                  className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium text-sm">
                      {savedPhones.length} Nomor Tersimpan
                    </span>
                  </div>
                  {isPhoneListOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                
                <div 
                  className={`transition-all overflow-hidden ${isPhoneListOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="p-3 space-y-2 bg-white">
                    {savedPhones.map((phone, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-200">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{phone}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            type="button"
                            onClick={() => {
                              setSelectedPhoneOption(phone);
                              setPhoneInput(phone);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleRemovePhone(phone)}
                            disabled={isDeleting}
                            className={`text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isDeleting ? (
                              <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {savedPhones.length > 0 && (
              <select
                value={selectedPhoneOption}
                onChange={handlePhoneOptionChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="new">Input Nomor Baru</option>
                {savedPhones.map((p, idx) => (
                  <option key={idx} value={p}>
                    Edit: {p}
                  </option>
                ))}
              </select>
            )}
            
            <input
              type="text"
              placeholder="Nomor HP harus diawali 0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-blue-600" />
              Password
            </label>
            <input
              type="password"
              placeholder="Masukkan password baru (opsional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">Biarkan kosong jika tidak ingin mengubah password</p>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </form>
        
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Pastikan data yang Anda masukkan sudah benar sebelum menyimpan perubahan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
