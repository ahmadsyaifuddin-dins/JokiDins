import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Lock, Save, Trash, Edit, ChevronDown, ChevronUp } from "lucide-react";

const UpdateProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savedPhones, setSavedPhones] = useState(user?.phones || []);
  const [selectedPhoneOption, setSelectedPhoneOption] = useState("new");
  const [phoneInput, setPhoneInput] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneListOpen, setIsPhoneListOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSavedPhones(user.phones || []);
      setSelectedPhoneOption("new");
      setPhoneInput("");
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

  const handleRemovePhone = (phoneToRemove) => {
    setSavedPhones(savedPhones.filter(p => p !== phoneToRemove));
    if (selectedPhoneOption === phoneToRemove) {
      setSelectedPhoneOption("new");
      setPhoneInput("");
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

      const res = await axios.put(
        "https://jokidins-production.up.railway.app/api/user/profile",
        { name, email, phones: updatedPhones, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = res.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Show success notification instead of alert
      showNotification("Profile berhasil diupdate!", "success");
      
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Update profile error:", error);
      showNotification("Gagal update profile.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-16 right-4 p-4 rounded-lg shadow-lg flex items-center ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white max-w-xs animate-fade-in-slide`;
    
    notification.innerHTML = `
      <div class="mr-3">
        ${type === "success" ? 
          '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : 
          '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
        }
      </div>
      <p>${message}</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add("animate-fade-out-slide");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
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
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">
                  <User className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-600" />
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">
                  <Mail className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
          
          {/* Phone Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                Nomor Telepon
              </label>
              {selectedPhoneOption === "new" && (
                <span className="text-xs text-blue-600 flex items-center">
                  Tambah baru
                </span>
              )}
              {selectedPhoneOption !== "new" && (
                <span className="text-xs text-blue-600 flex items-center">
                  Edit nomor
                </span>
              )}
            </div>
            
            {/* Phone Numbers Accordion */}
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
                
                {/* Accordion Content */}
                <div 
                  className={`transition-all overflow-hidden ${
                    isPhoneListOpen 
                      ? "max-h-64 opacity-100" 
                      : "max-h-0 opacity-0"
                  }`}
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
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Phone Selection Dropdown */}
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
            
            {/* Phone Input Field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Nomor HP harus diawali 0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">
                  <Phone className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-blue-600" />
              Password Baru <span className="text-xs text-gray-500 ml-1">(opsional)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">
                  <Lock className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Simpan Perubahan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;