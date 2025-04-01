import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from '../config';

// Import komponen terpisah
import TabButtons from "../components/UpdateProfile/TabButtons";
import BasicForm from "../components/UpdateProfile/BasicForm";
import ContactForm from "../components/UpdateProfile/ContactForm";
import SecurityForm from "../components/UpdateProfile/SecurityForm";

const UpdateProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State utama
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
  const [section, setSection] = useState("basic"); // "basic", "contact", "security"

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
      const updatedPhones = savedPhones.filter((p) => p !== phoneToRemove);
      setSavedPhones(updatedPhones);

      if (selectedPhoneOption === phoneToRemove) {
        setSelectedPhoneOption("new");
        setPhoneInput("");
      }

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/api/user/profile`,
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
        `${API_BASE_URL}/api/user/profile`,
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
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-gray-700 hover:text-blue-600 mb-2 transition-all group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Profile</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
          <p className="text-gray-600 mt-1">
            Perbarui informasi akun Anda dan pengaturan profil
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 relative">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center border-4 border-white">
              <span className="text-4xl font-bold text-blue-600">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div className="text-center mt-3">
              <h2 className="text-xl font-bold text-white">
                {name || "Username"}
              </h2>
              <p className="text-blue-100 mt-1 truncate">
                {email || "email@example.com"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <TabButtons section={section} setSection={setSection} />

            {section === "basic" && (
              <BasicForm
                name={name}
                setName={setName}
                email={email}
                birthday={birthday}
                setBirthday={setBirthday}
                gender={gender}
                setGender={setGender}
              />
            )}

            {section === "contact" && (
              <ContactForm
                savedPhones={savedPhones}
                selectedPhoneOption={selectedPhoneOption}
                setSelectedPhoneOption={setSelectedPhoneOption}
                phoneInput={phoneInput}
                setPhoneInput={setPhoneInput}
                handleRemovePhone={handleRemovePhone}
                togglePhoneList={togglePhoneList}
                isPhoneListOpen={isPhoneListOpen}
                isDeleting={isDeleting}
                handlePhoneOptionChange={handlePhoneOptionChange}
              />
            )}

            {section === "security" && (
              <SecurityForm
                password={password}
                setPassword={setPassword}
              />
            )}

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg font-medium text-white flex items-center justify-center transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
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

        <style>{`
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
