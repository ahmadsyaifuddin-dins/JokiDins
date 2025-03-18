import React, { useState, useEffect } from "react";
import '../css/button_glow_notif.css';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Check,
  FileText,
  Calendar,
  Send,
} from "lucide-react";
import { toast } from "react-hot-toast";
import OrderHeader from "../components/orderCreate/OrderCreateHeader";
import PhoneInput from "../components/orderCreate/PhoneInput";
import TelegramLinkButton from "../components/TelegramLinkButton";
import { detectProvider, validatePhone, providerColors } from "../utils/phoneHelper";

const OrderCreate = () => {
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State untuk nomor HP
  const [savedPhones, setSavedPhones] = useState([]);
  const [selectedPhoneOption, setSelectedPhoneOption] = useState("new");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("Unknown");

  // State untuk profile user (termasuk telegramChatId)
  const [isTelegramLinked, setIsTelegramLinked] = useState(false);
  const [isCheckingTelegram, setIsCheckingTelegram] = useState(true);

  const navigate = useNavigate();

  // Ambil profile user untuk cek apakah akun Telegram sudah di-link
  useEffect(() => {
    const fetchProfile = async () => {
      setIsCheckingTelegram(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("https://jokidins-production.up.railway.app/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Asumsi field telegramChatId ada di profile
        if (res.data.telegramChatId) {
          setIsTelegramLinked(true);
        } else {
          setIsTelegramLinked(false);
        }
      } catch (error) {
        console.error("Gagal mengambil profile:", error);
      } finally {
        setIsCheckingTelegram(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPhones = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("https://jokidins-production.up.railway.app/api/user/phones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedPhones(res.data);
      } catch (error) {
        console.error("Gagal ambil nomor HP tersimpan:", error);
        toast.error("Gagal memuat nomor HP tersimpan", {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      }
    };
    fetchPhones();
  }, []);

  useEffect(() => {
    if (selectedPhoneOption !== "new") {
      setPhone(selectedPhoneOption);
      setProvider(detectProvider(selectedPhoneOption));
    } else {
      setPhone("");
      setProvider("Unknown");
    }
  }, [selectedPhoneOption]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      toast.success(`File "${selectedFile.name}" berhasil diunggah`, {
        icon: <Check className="h-5 w-5 text-green-500" />,
      });
    }
  };

  const handlePhoneInputChange = (e) => {
    let input = e.target.value;
    if (input && !input.startsWith("0")) {
      input = "0" + input;
    }
    setPhone(input);
    setProvider(detectProvider(input));
  };

  const checkTelegramStatus = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://jokidins-production.up.railway.app/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.telegramChatId) {
        setIsTelegramLinked(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal mengecek status Telegram:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (selectedPhoneOption === "new") {
      if (!validatePhone(phone)) {
        toast.error("Nomor HP tidak valid. Pastikan format dan panjangnya benar.", {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
        return;
      }
    } else {
      if (!validatePhone(selectedPhoneOption)) {
        toast.error("Nomor HP tersimpan tidak valid.", {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
        return;
      }
    }

    // Periksa kembali status Telegram jika belum terhubung
    if (!isTelegramLinked) {
      const linked = await checkTelegramStatus();
      if (!linked) {
        const confirmSubmit = await Swal.fire({
          title: "Kamu belum menghubungkan Telegram!",
          text: "Lanjutkan order tanpa notifikasi Telegram?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, lanjutkan",
          cancelButtonText: "Batal",
          customClass: {
            confirmButton: "glow-confirm-button",
            cancelButton: "glow-cancel-button"
          }
        });
        if (!confirmSubmit.isConfirmed) return;
      } else {
        setIsTelegramLinked(true);
      }
    }
    
    setIsLoading(true);

    const formData = new FormData();
    formData.append("service", service);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("phone", selectedPhoneOption === "new" ? phone : selectedPhoneOption);
    formData.append("provider", provider);

    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("https://jokidins-production.up.railway.app/api/orders", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Order berhasil dibuat!", {
        icon: <Check className="h-5 w-5 text-green-500" />,
        duration: 4000,
      });

      setTimeout(() => {
        navigate("/OrderList");
      }, 1500);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Gagal membuat order. Silakan coba lagi.", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramLinked = () => {
    setIsTelegramLinked(true);
    toast.success("Akun Telegram berhasil terhubung!", {
      icon: <Check className="h-5 w-5 text-green-500" />,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-4">
        {/* Tampilkan card notifikasi Telegram jika belum terhubung */}
        {!isCheckingTelegram && !isTelegramLinked && (
          <div className="mb-6 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg transform transition-all">
            <div className="relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white"></div>
              </div>
              
              <div className="relative p-6">
                <div className="flex items-start">
                  <div className="hidden md:block bg-white bg-opacity-20 p-3 rounded-full mr-4">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      Aktifkan Notifikasi Telegram
                    </h3>
                    <p className="text-blue-100 text-sm mb-4">
                      Dapatkan update real-time status order langsung ke Telegram kamu. Kamu akan mendapatkan notifikasi saat order diproses, selesai, atau ada perubahan status.
                    </p>
                    
                    <div className="mt-2">
                      <TelegramLinkButton onLinked={handleTelegramLinked} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tampilkan badge sukses jika sudah terhubung */}
        {!isCheckingTelegram && isTelegramLinked && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center">
            <div className="bg-green-500 rounded-full p-1 mr-3">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-green-800 font-medium">
                Telegram sudah terhubung! Kamu akan menerima notifikasi status order.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <OrderHeader />
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="service" className="flex items-center text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Joki Apa
                </label>
                <input
                  id="service"
                  type="text"
                  placeholder="Bikin PPT, Bikin Aplikasi Web, dll"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Deskripsi Joki
                </label>
                <textarea
                  id="description"
                  placeholder="Jelaskan detail kebutuhan anda"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="deadline" className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  Deadline (Tanggal & Waktu)
                </label>
                <input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <PhoneInput
                savedPhones={savedPhones}
                selectedPhoneOption={selectedPhoneOption}
                setSelectedPhoneOption={setSelectedPhoneOption}
                phone={phone}
                handlePhoneInputChange={handlePhoneInputChange}
                provider={provider}
                providerColors={providerColors}
                detectProvider={detectProvider}
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 px-4 rounded-lg 
                           hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium text-sm ${
                             isLoading ? "opacity-70 cursor-not-allowed" : ""
                           }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Sedang Memproses...
                    </>
                  ) : (
                    "Buat Order"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCreate;
