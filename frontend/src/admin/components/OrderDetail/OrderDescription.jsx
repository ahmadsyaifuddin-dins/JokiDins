// OrderDetailComponents/OrderDescription.jsx
import React from "react";
import { FileText } from "lucide-react";

const OrderDescription = ({ description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Deskripsi Pesanan
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-gray-700 whitespace-pre-line">
            {description || "Tidak ada deskripsi"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDescription;