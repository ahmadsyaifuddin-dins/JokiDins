import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  Check,
  Upload,
  Phone,
  Calendar,
  FileText,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

// Fungsi untuk deteksi provider, termasuk Smartfren dan Axis
function detectProvider(phone) {
  const digits = phone.replace(/\D/g, ""); // hapus karakter non-digit

  // Daftar prefix masing-masing provider (contoh, sesuaikan dengan data aktual)
  const telkomselPrefixes = [
    "0811",
    "0812",
    "0813",
    "0821",
    "0822",
    "0823",
    "0851",
    "0852",
    "0853",
    "0828",
  ];
  const indosatPrefixes = [
    "0814",
    "0815",
    "0816",
    "0855",
    "0856",
    "0857",
    "0858",
  ];
  const xlPrefixes = ["0817", "0818", "0819", "0859", "0877", "0878", "0879"];
  const triPrefixes = ["0895", "0896", "0897", "0898", "0899"];
  const smartfrenPrefixes = [
    "0881",
    "0882",
    "0883",
    "0884",
    "0885",
    "0886",
    "0887",
    "0888",
    "0889",
  ];
  const axisPrefixes = ["0831", "0832", "0833", "0838"];

  // Cek dengan mengambil 4 atau 3 digit awal
  const prefix4 = digits.substring(0, 4);
  const prefix3 = digits.substring(0, 3);

  if (
    telkomselPrefixes.includes(prefix4) ||
    telkomselPrefixes.includes(prefix3)
  ) {
    return "Telkomsel";
  } else if (
    indosatPrefixes.includes(prefix4) ||
    indosatPrefixes.includes(prefix3)
  ) {
    return "Indosat";
  } else if (xlPrefixes.includes(prefix4) || xlPrefixes.includes(prefix3)) {
    return "XL";
  } else if (triPrefixes.includes(prefix4) || triPrefixes.includes(prefix3)) {
    return "Tri";
  } else if (
    smartfrenPrefixes.includes(prefix4) ||
    smartfrenPrefixes.includes(prefix3)
  ) {
    return "Smartfren";
  } else if (axisPrefixes.includes(prefix4) || axisPrefixes.includes(prefix3)) {
    return "Axis";
  }
  return "Unknown";
}

// Fungsi validasi dasar nomor HP: harus mulai dengan 0 dan memiliki panjang 9-14 digit
function validatePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (!digits.startsWith("0")) return false; // Pastikan dimulai dengan 0
  if (digits.length < 9 || digits.length > 14) return false;
  return true;
}

const OrderCreate = () => {
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State untuk nomor HP
  const [savedPhones, setSavedPhones] = useState([]); // daftar nomor yang sudah tersimpan
  const [selectedPhoneOption, setSelectedPhoneOption] = useState("new"); // 'new' atau nilai nomor dari savedPhones
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("Unknown");

  const navigate = useNavigate();

  // Fetch saved phone numbers dari backend (endpoint: GET /api/user/phones)
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
        // Misalnya respon berupa array string: ["08123456789", "08234567890"]
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

  // Jika user memilih nomor yang sudah tersimpan, set phone dan provider
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
    // Jika input tidak dimulai dengan "0", secara otomatis tambahkan "0" di awal
    if (input && !input.startsWith("0")) {
      input = "0" + input;
    }
    setPhone(input);
    setProvider(detectProvider(input));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validasi nomor HP jika input dari "Input Nomor Baru"
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
      // Jika menggunakan nomor tersimpan, validasi tetap bisa diterapkan (opsional)
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
    // Gunakan nomor yang dipilih atau input baru
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

      // Delay navigasi sebentar agar toast bisa dilihat
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

  const providerColors = {
    Telkomsel: "text-red-500",
    Indosat: "text-yellow-500",
    XL: "text-blue-500",
    Tri: "text-green-500",
    Smartfren: "text-purple-500",
    Axis: "text-violet-600",
    Unknown: "text-gray-500",
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
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4">
            <button
              onClick={() => navigate("/OrderList")}
              className="flex items-center text-white hover:text-blue-100 mb-6 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali ke Daftar Pesanan</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Buat Order Baru</h1>
            <p className="text-blue-100 mt-1">
              Silakan isi detail order anda di bawah ini
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service */}
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

              {/* Description */}
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

              {/* Deadline */}
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

              {/* Phone Number Section */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  Nomor HP / WA Aktif
                </label>

                {/* Dropdown untuk memilih nomor yang tersimpan */}
                {savedPhones.length > 0 && (
                  <div className="relative">
                    <select
                      value={selectedPhoneOption}
                      onChange={(e) => setSelectedPhoneOption(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               outline-none transition-colors appearance-none"
                    >
                      <option value="new">-- Input Nomor Baru --</option>
                      {savedPhones.map((num, idx) => (
                        <option key={idx} value={num}>
                          {num} ({detectProvider(num)})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Jika memilih "Input Nomor Baru", tampilkan input field */}
                {selectedPhoneOption === "new" && (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="Contoh: 08123456789"
                        value={phone}
                        onChange={handlePhoneInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 outline-none transition-colors"
                      />
                    </div>
                    {phone && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">Provider:</span>
                        <span
                          className={`text-sm font-medium ml-2 ${providerColors[provider]}`}
                        >
                          {provider}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* File Upload */}
              {/* <div className="space-y-2">
                <label 
                  htmlFor="file" 
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Upload className="h-4 w-4 mr-2 text-blue-600" />
                  Upload File (disarankan kirim ke WA admin aja :D)
                </label>
                <div className="mt-1">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-blue-500" />
                        <p className="mb-1 text-sm text-blue-500 font-medium">Klik untuk upload file</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG, PDF, DOC atau DOCX (Max. 10MB)</p>
                      </div>
                      <input 
                        id="file-upload" 
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {fileName && (
                    <div className="flex items-center mt-2 p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600 truncate">
                        {fileName}
                      </span>
                    </div>
                  )}
                </div>
              </div> */}

              {/* Submit */}
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
