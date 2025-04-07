import React from "react";

const OrderDescription = ({ description }) => (
  <div className="transition-all hover:shadow-md rounded-xl">
    <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
      <span className="inline-block w-1 h-4 bg-blue-500 mr-2 rounded"></span>
      Deskripsi Pesanan
    </h2>
    <div className="text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100">
      {description ? (
        <p className="whitespace-pre-line">{description}</p>
      ) : (
        <p className="italic text-gray-400">Tidak ada deskripsi</p>
      )}
    </div>
  </div>
);

export default OrderDescription;
