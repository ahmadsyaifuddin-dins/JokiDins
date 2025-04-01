// components/OrderGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Pencil, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  User, 
  Package, 
  DollarSign,
  Calendar
} from "lucide-react";

export const OrderGrid = ({ orders, onStatusChange, onSetFixedAmount, loading }) => {
  const formatCurrency = (amount) => {
    return amount
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount)
      : "Rp0";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "lunas":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Lunas
          </span>
        );
      case "dicicil":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Dicicil
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Belum Dibayar
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p className="text-lg font-medium">Tidak ada order yang ditemukan</p>
          <p className="text-sm text-gray-400 mt-1">
            Silahkan refresh halaman atau periksa kembali nanti
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {orders.map((order) => (
        <div 
          key={order._id} 
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <div className="font-mono text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded shadow-sm">
              {order._id.slice(-8).toUpperCase()}
            </div>
            {getStatusBadge(order.paymentStatus)}
          </div>
          
          <div className="px-4 py-3">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-3 shadow-sm">
                {(order.user?.name || "NA").charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {order.user?.name || "Not Available"}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {order.user?._id?.slice(-6) || "N/A"}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start text-sm">
                <Package className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className="text-gray-600 mr-1">Paket:</span>
                  {order.packageName ? (
                    <Link to="/pricing" className="text-blue-600 hover:underline">
                      {order.packageName}
                    </Link>
                  ) : (
                    <span className="text-gray-500 italic">Not Available</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-start text-sm">
                <DollarSign className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className="text-gray-600 mr-1">Nominal Input:</span>
                  <span className="font-medium">{formatCurrency(order.paymentAmount)}</span>
                </div>
              </div>
              
              <div className="flex items-start text-sm">
                <DollarSign className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className="text-gray-600 mr-1">Nominal Fixed:</span>
                  <span className={`font-medium ${order.fixedAmount ? 'text-blue-600' : 'text-gray-400 italic'}`}>
                    {formatCurrency(order.fixedAmount) || "Belum diatur"}
                  </span>
                </div>
              </div>
              
              {order.createdAt && (
                <div className="flex items-start text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 mr-1">Tanggal Order:</span>
                    <span className="text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
            <button
              onClick={() => onStatusChange(order._id, "belum dibayar")}
              className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded-full hover:bg-yellow-200 text-xs transition-colors flex-grow"
            >
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Belum Dibayar
            </button>
            <button
              onClick={() => onStatusChange(order._id, "dicicil")}
              className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 text-xs transition-colors flex-grow"
            >
              <Clock className="w-3 h-3 inline mr-1" />
              Dicicil
            </button>
            <button
              onClick={() => onStatusChange(order._id, "lunas")}
              className="px-3 py-1 bg-green-100 text-green-900 rounded-full hover:bg-green-200 text-xs transition-colors flex-grow"
            >
              <CheckCircle className="w-3 h-3 inline mr-1" />
              Lunas
            </button>
            <button
              onClick={() => onSetFixedAmount(order._id)}
              className="w-full mt-1 py-2 flex items-center justify-center space-x-1 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 text-xs transition-colors"
            >
              <Pencil className="h-3 w-3" />
              <span>Set Fixed Amount</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};