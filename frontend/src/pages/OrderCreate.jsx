// OrderCreate.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Check,
  FileText,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import OrderHeader from "../components/orderCreate/OrderCreateHeader";
import PhoneInput from "../components/orderCreate/PhoneInput";
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhones = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "https://jokidins-production.up.railway.app/api/user/phones",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (selectedPhoneOption === "new") {
      if (!validatePhone(phone)) {
        toast.error(
          "Nomor HP tidak valid. Pastikan format dan panjangnya benar.",
          {
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          }
        );
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

    setIsLoading(true);

    const formData = new FormData();
    formData.append("service", service);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append(
      "phone",
      selectedPhoneOption === "new" ? phone : selectedPhoneOption
    );
    formData.append("provider", provider);

    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post(
        "https://jokidins-production.up.railway.app/api/orders",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm font-medium",
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#333333",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.5rem",
          },
        }}
      />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <OrderHeader />
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="service"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Deskripsi Joki
                </label>
                <textarea
                  id="description"
                  placeholder="Jelaskan detail kebutuhan anda"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="deadline"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  Deadline (Tanggal & Waktu)
                </label>
                <input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition-colors"
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

              {/* Jika file upload diaktifkan, bisa tambahkan komponen FileUpload di sini */}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 px-4 rounded-lg 
                           hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2 
                           transition-all font-medium text-sm ${
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
