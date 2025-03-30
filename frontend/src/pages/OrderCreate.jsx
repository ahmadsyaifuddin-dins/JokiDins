import React, { useRef, useState, useEffect, useContext } from "react";
import "../styles/button_glow_notif.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Check, FileText, Calendar, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import OrderHeader from "../components/orderCreate/OrderCreateHeader";
import PhoneInput from "../components/orderCreate/PhoneInput";
import TelegramLinkButton from "../components/TelegramLinkButton";
import {
  detectProvider,
  validatePhone,
  providerColors,
} from "../utils/phoneHelper";
import Button from "../components/orderCreate/Button";
import ButtonDefault from "../components/orderCreate/ButtonDefault";
import { AuthContext } from "../context/AuthContext";
import { checkTelegramStatus, submitOrder } from "../utils/orderUtils";
// Import data paket dan fungsi pricing utils
import { pricingPlans } from "../utils/pricingData";
import { getPriceRange, formatPriceRange, isPriceWithinRange } from "../utils/pricingUtils";
import { useUserProfile } from "../hooks/orderCreate/useUserProfile";
import { useSavedPhones } from "../hooks/orderCreate/useSavedPhones";

const OrderCreate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // Ambil nama paket yang dipilih dari query parameter
  const selectedPlanName = queryParams.get("plan");

  // Temukan paket yang dipilih dari data statis
  const chosenPlan = pricingPlans.find((plan) => plan.name === selectedPlanName);
  const priceRange = chosenPlan ? getPriceRange(chosenPlan) : null;

  // State untuk order
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State untuk input nominal pembayaran sesuai kesepakatan paket
  const [paymentAmount, setPaymentAmount] = useState("");

  // Ref untuk validasi form
  const formRef = useRef(null);

  // Global context
  const { user, setUser } = useContext(AuthContext);

  // Custom hooks untuk nomor HP dan profile Telegram
  const savedPhones = useSavedPhones();
  const { isTelegramLinked, isCheckingTelegram } = useUserProfile();

  // State untuk nomor HP input
  const [selectedPhoneOption, setSelectedPhoneOption] = useState("new");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("Unknown");

  const navigate = useNavigate();

  // Update nomor HP berdasarkan opsi yang dipilih
  useEffect(() => {
    if (selectedPhoneOption !== "new") {
      setPhone(selectedPhoneOption);
      setProvider(detectProvider(selectedPhoneOption));
    } else {
      setPhone("");
      setProvider("Unknown");
    }
  }, [selectedPhoneOption]);

  useEffect(() => {
    if (!selectedPlanName) {
      // Redirect ke PricingPage jika tidak ada paket dipilih
      navigate("/pricing", { replace: true });
      // Atau, bisa juga tampilkan alert dan disable form
      // toast.error("Silakan pilih paket terlebih dahulu.");
    }
  }, [selectedPlanName, navigate]);

  // Handler file upload
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

  // Handler untuk input nomor HP
  const handlePhoneInputChange = (e) => {
    let input = e.target.value;
    if (input && !input.startsWith("0")) {
      input = "0" + input;
    }
    setPhone(input);
    setProvider(detectProvider(input));
  };

  const checkTelegramStatus = async (token) => {
    try {
      const res = await axios.get("https://jokidins-production.up.railway.app/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.telegramChatId) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Gagal mengecek status Telegram:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    if (!formRef.current.checkValidity()) {
      e.preventDefault();
      formRef.current.reportValidity();
      return;
    }
    e.preventDefault();
    if (isLoading) return;

    const token = localStorage.getItem("token");

    // Validasi nomor HP
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

    // Validasi nominal pembayaran sesuai dengan rentang paket, jika paket dipilih
    if (chosenPlan) {
      const amount = Number(paymentAmount);
      if (!isPriceWithinRange(chosenPlan, amount)) {
        toast.error(`Nominal pembayaran harus antara ${formatPriceRange(chosenPlan)}`);
        return;
      }
    }

    // Cek status Telegram jika belum terhubung
    if (!isTelegramLinked) {
      const linked = await checkTelegramStatus(token);
      if (!linked) {
        const confirmSubmit = await Swal.fire({
          title: "Kamu belum menghubungkan Telegram!",
          text: "Lanjutkan order tanpa notifikasi Telegram?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, lanjutkan",
          cancelButtonText: "Batal",
        });
        if (!confirmSubmit.isConfirmed) return;
      }
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("service", service);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("phone", selectedPhoneOption === "new" ? phone : selectedPhoneOption);
    formData.append("provider", provider);
    // Sertakan nominal pembayaran jika paket dipilih
    if (chosenPlan) {
      formData.append("paymentAmount", paymentAmount);
    }
    if (file) {
      formData.append("file", file);
    }

    try {
      await submitOrder(formData, token);
      toast.success("Order berhasil dibuat!", {
        icon: <Check className="h-5 w-5 text-green-500" />,
        duration: 4000,
      });
      // Update global state user: simpan nomor baru jika opsi baru dipilih
      if (selectedPhoneOption === "new" && user) {
        const updatedPhones = user.phones ? [...user.phones, phone] : [phone];
        setUser({ ...user, phones: updatedPhones });
        localStorage.setItem("user", JSON.stringify({ ...user, phones: updatedPhones }));
      }
      setTimeout(() => {
        navigate("/OrderList");
      }, 1500);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Gagal membuat order. Silakan coba lagi.", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-4">
        {/* Notifikasi Telegram */}
        {!isCheckingTelegram && !isTelegramLinked && (
          <div className="mb-6 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg transition-all">
            <div className="relative">
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
                      Dapatkan update real-time status order langsung ke Telegram kamu.
                    </p>
                    <div className="mt-2">
                      <TelegramLinkButton onLinked={() => {}} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {selectedPlanName && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-800">Paket yang dipilih: {selectedPlanName}</p>
                  {chosenPlan && (
                    <p className="text-blue-800">
                      Rentang Harga: {formatPriceRange(chosenPlan)}
                    </p>
                  )}
                </div>
              )}

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

              {/* Input Nominal Pembayaran Berdasarkan Paket */}
              {chosenPlan && (
                <div className="space-y-2">
                  <label htmlFor="payment" className="block text-sm font-medium text-gray-700">
                    Nominal Pembayaran (Rentang: {formatPriceRange(chosenPlan)})
                  </label>
                  <input
                    id="payment"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

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

              <div className="space-y-2">
                <Button onClick={handleSubmit} isLoading={isLoading} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCreate;
