import React, { useRef, useState, useEffect, useContext } from "react";
import "../styles/button_glow_notif.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Check } from "lucide-react";
import { toast } from "react-hot-toast";

// Import reusable components
import OrderHeader from "../components/orderCreate/OrderCreateHeader";
import PhoneInput from "../components/orderCreate/PhoneInput";
import Button from "../components/orderCreate/Button";
import PackageSelection from "../components/orderCreate/PackageSelection";
import TelegramNotification from "../components/orderCreate/TelegramNotification";
import ServiceInput from "../components/orderCreate/ServiceInput";
import DescriptionInput from "../components/orderCreate/DescriptionInput";
import DeadlineInput from "../components/orderCreate/DeadlineInput";
import PaymentInput from "../components/orderCreate/PaymentInput";
// import FileUpload from "../components/orderCreate/FileUpload";

import { AuthContext } from "../context/AuthContext";
import { validatePhone, detectProvider, providerColors } from "../utils/phoneHelper";
import { checkTelegramStatus, submitOrder } from "../utils/orderUtils";
import { pricingPlans } from "../utils/pricingData";
import { getPriceRange, formatPriceRange, isPriceWithinRange } from "../utils/pricingUtils";
import { useUserProfile } from "../hooks/orderCreate/useUserProfile";
import { useSavedPhones } from "../hooks/orderCreate/useSavedPhones";

const OrderCreate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlanName = queryParams.get("plan");

  // Find selected plan from static data
  const chosenPlan = pricingPlans.find(
    (plan) => plan.name === selectedPlanName
  );
  const [paymentError, setPaymentError] = useState("");
  const [formattedPaymentDisplay, setFormattedPaymentDisplay] = useState("");

  // Order states
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  // Form ref for validation
  const formRef = useRef(null);

  // Global context
  const { user, setUser } = useContext(AuthContext);

  // Custom hooks
  const savedPhones = useSavedPhones();
  const { isTelegramLinked, isCheckingTelegram } = useUserProfile();

  // Phone state
  const [selectedPhoneOption, setSelectedPhoneOption] = useState("new");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("Unknown");

  const navigate = useNavigate();

  // Update phone based on selected option
  useEffect(() => {
    if (selectedPhoneOption !== "new") {
      setPhone(selectedPhoneOption);
      setProvider(detectProvider(selectedPhoneOption));
    } else {
      setPhone("");
      setProvider("Unknown");
    }
  }, [selectedPhoneOption]);

  // Redirect if no plan selected
  useEffect(() => {
    if (!selectedPlanName) {
      navigate("/pricing", { replace: true });
    }
  }, [selectedPlanName, navigate]);

  // Format payment display
  useEffect(() => {
    if (chosenPlan && paymentAmount) {
      setFormattedPaymentDisplay(
        new Intl.NumberFormat("id-ID").format(parseInt(paymentAmount, 10))
      );
    } else {
      setFormattedPaymentDisplay("");
    }
  }, [chosenPlan, paymentAmount]);

  // Phone input handler
  const handlePhoneInputChange = (e) => {
    let input = e.target.value;
    if (input && !input.startsWith("0")) {
      input = "0" + input;
    }
    setPhone(input);
    setProvider(detectProvider(input));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    if (!formRef.current.checkValidity()) {
      e.preventDefault();
      formRef.current.reportValidity();
      return;
    }
    e.preventDefault();
    if (isLoading) return;

    const token = localStorage.getItem("token");

    // Phone validation
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

    // Payment validation
    if (chosenPlan) {
      const amount = Number(paymentAmount);
      if (!isPriceWithinRange(chosenPlan, amount)) {
        toast.error(
          `Nominal pembayaran harus antara ${formatPriceRange(chosenPlan)}`
        );
        return;
      }
    }

    // Telegram check
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
    formData.append(
      "phone",
      selectedPhoneOption === "new" ? phone : selectedPhoneOption
    );
    formData.append("provider", provider);
    
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
      
      // Update user phones
      if (selectedPhoneOption === "new" && user) {
        const updatedPhones = user.phones ? [...user.phones, phone] : [phone];
        setUser({ ...user, phones: updatedPhones });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, phones: updatedPhones })
        );
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
        {/* Telegram Notification Component */}
        <TelegramNotification 
          isCheckingTelegram={isCheckingTelegram} 
          isTelegramLinked={isTelegramLinked} 
          onLinked={() => {}}
        />

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <OrderHeader />
          <div className="p-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Package Selection Component */}
              <PackageSelection 
                selectedPlanName={selectedPlanName} 
                formatPriceRange={formatPriceRange} 
                chosenPlan={chosenPlan} 
              />

              {/* Service Input Component */}
              <ServiceInput service={service} setService={setService} />

              {/* Description Input Component */}
              <DescriptionInput description={description} setDescription={setDescription} />

              {/* Deadline Input Component */}
              <DeadlineInput deadline={deadline} setDeadline={setDeadline} />

              {/* Payment Input Component */}
              <PaymentInput 
                formattedPaymentDisplay={formattedPaymentDisplay}
                setFormattedPaymentDisplay={setFormattedPaymentDisplay}
                setPaymentAmount={setPaymentAmount}
                setPaymentError={setPaymentError}
                paymentError={paymentError}
                chosenPlan={chosenPlan}
                getPriceRange={getPriceRange}
                formatPriceRange={formatPriceRange}
                paymentAmount={paymentAmount}
              />

              {/* File Upload Component */}
              {/* <FileUpload 
                file={file}
                setFile={setFile}
                fileName={fileName}
                setFileName={setFileName}
              /> */}

              {/* Phone Input Component (already modular) */}
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

              {/* Submit Button */}
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