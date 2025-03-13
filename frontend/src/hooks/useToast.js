// src/hooks/useToast.js
import toast from "react-hot-toast";

const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      style: {
        background: "#4ade80",
        color: "#fff",
        padding: "16px",
        borderRadius: "10px",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#4ade80",
      },
      duration: 3000,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      style: {
        background: "#f87171",
        color: "#fff",
        padding: "16px",
        borderRadius: "10px",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#f87171",
      },
      duration: 4000,
    });
  };

  return { showSuccess, showError };
};

export default useToast;
