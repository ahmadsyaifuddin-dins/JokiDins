// OrderCreateHeader.jsx
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderCreateHeader = () => {
  const navigate = useNavigate();
  return (
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
  );
};

export default OrderCreateHeader;
