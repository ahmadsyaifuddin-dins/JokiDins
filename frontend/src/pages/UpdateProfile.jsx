import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, User, Mail, Phone, Lock, Save, Trash, Edit, 
  ChevronDown, ChevronUp, Calendar, UserCircle, AlertCircle
} from "lucide-react";
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
  const [birthday, setBirthday] = useState(user?.birthday || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneListOpen, setIsPhoneListOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [section, setSection] = useState("basic"); // basic, contact, security

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
        "http://localhost:5000/api/user/profile",
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

      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
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

  const renderTabButtons = () => (
    <div className="grid grid-cols-3 gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
      <button
        type="button"
        onClick={() => setSection("basic")}
        className={`py-3 px-1 rounded-lg font-medium text-sm transition-colors ${
          section === "basic" 
            ? "bg-white shadow-sm text-blue-600" 
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <User className="h-4 w-4 mx-auto mb-1" />
        Profil
      </button>
      <button
        type="button"
        onClick={() => setSection("contact")}
        className={`py-3 px-1 rounded-lg font-medium text-sm transition-colors ${
          section === "contact" 
            ? "bg-white shadow-sm text-blue-600" 
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Phone className="h-4 w-4 mx-auto mb-1" />
        Kontak
      </button>
      <button
        type="button"
        onClick={() => setSection("security")}
        className={`py-3 px-1 rounded-lg font-medium text-sm transition-colors ${
          section === "security" 
            ? "bg-white shadow-sm text-blue-600" 
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Lock className="h-4 w-4 mx-auto mb-1" />
        Keamanan
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center text-gray-700 hover:text-blue-600 mb-2 transition-all group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Profile</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi akun Anda dan pengaturan profil</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 relative">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center border-4 border-white">
              <span className="text-4xl font-bold text-blue-600">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div className="text-center mt-3">
              <h2 className="text-xl font-bold text-white">{name || "Username"}</h2>
              <p className="text-blue-100 mt-1">{email || "email@example.com"}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {renderTabButtons()}
            
            {section === "basic" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Nama Lengkap
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="email"
                      placeholder="Masukkan email"
                      className="w-full p-3 pl-10 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={email}
                      readOnly
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      Tanggal Lahir
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="date"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 items-center">
                      <UserCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Jenis Kelamin
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <select
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {section === "contact" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Tambahkan nomor telepon untuk meningkatkan keamanan akun Anda
                      </p>
                    </div>
                  </div>
                </div>
                
                {savedPhones.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={togglePhoneList}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            {savedPhones.length} Nomor Tersimpan
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Kelola semua nomor telepon Anda
                          </p>
                        </div>
                      </div>
                      {isPhoneListOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    <div 
                      className={`transition-all overflow-hidden ${isPhoneListOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="p-4 space-y-3 bg-white">
                        {savedPhones.map((phone, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                            <div className="flex items-center">
                              <div className="bg-gray-200 p-2 rounded-full mr-3">
                                <Phone className="h-4 w-4 text-gray-600" />
                              </div>
                              <span className="font-medium">{phone}</span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  setSelectedPhoneOption(phone);
                                  setPhoneInput(phone);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                title="Edit nomor"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleRemovePhone(phone)}
                                disabled={isDeleting}
                                className={`text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                                title="Hapus nomor"
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
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pilih Aksi
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <select
                        value={selectedPhoneOption}
                        onChange={handlePhoneOptionChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                      >
                        <option value="new">Input Nomor Baru</option>
                        {savedPhones.map((p, idx) => (
                          <option key={idx} value={p}>
                            Edit: {p}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {selectedPhoneOption === "new" ? (
                          <Phone className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Edit className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 items-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-600" />
                    {selectedPhoneOption === "new" ? "Nomor Telepon Baru" : "Edit Nomor Telepon"}
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="text"
                      placeholder="Nomor HP harus diawali 0"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 ml-1">
                    Contoh: 081234567890
                  </p>
                </div>
              </div>
            )}
            
            {section === "security" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-5">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-700">
                        Ubah password secara berkala untuk meningkatkan keamanan akun Anda
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 items-center">
                    <Lock className="h-4 w-4 mr-2 text-blue-600" />
                    Password Baru
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="password"
                      placeholder="Masukkan password baru (opsional)"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <AlertCircle className="h-4 w-4 mr-1 text-gray-400" />
                    <p>Biarkan kosong jika tidak ingin mengubah password</p>
                  </div>
                  
                  <div className="mt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Kekuatan Password</h3>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${
                        !password ? 'w-0' :
                        password.length < 6 ? 'w-1/4 bg-red-500' :
                        password.length < 8 ? 'w-1/2 bg-amber-500' :
                        /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'w-full bg-green-500' :
                        'w-3/4 bg-blue-500'
                      }`}></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <p className={`text-xs ${password && password.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>Lemah</p>
                      <p className={`text-xs ${password && password.length >= 6 ? 'text-gray-900' : 'text-gray-400'}`}>Sedang</p>
                      <p className={`text-xs ${password && password.length >= 8 ? 'text-gray-900' : 'text-gray-400'}`}>Kuat</p>
                      <p className={`text-xs ${password && password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'text-gray-900' : 'text-gray-400'}`}>Sangat Kuat</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-600">
                    <p className="font-medium mb-2">Rekomendasi:</p>
                    <ul className="space-y-1 list-disc pl-5">
                      <li className={password.length >= 8 ? "text-green-600" : ""}>Minimal 8 karakter</li>
                      <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>Minimal 1 huruf kapital</li>
                      <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>Minimal 1 angka</li>
                      <li className={/[!@#$%^&*]/.test(password) ? "text-green-600" : ""}>Minimal 1 karakter khusus (!@#$%^&*)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg font-medium text-white flex items-center justify-center transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
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
              </div>
            </div>
          </form>
        </div>
        
        <style jsx>{`
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default UpdateProfile;