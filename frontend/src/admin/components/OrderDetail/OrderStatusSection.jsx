// OrderDetailComponents/OrderStatusSection.jsx
import React from "react";
import { CheckCircle, XCircle, RefreshCw, Clock4 } from "lucide-react";
import toast from "react-hot-toast";

const OrderStatusSection = ({ status, selectedStatus, setSelectedStatus, handleStatusChange }) => {
  const statuses = [
    { value: "pending", label: "Menunggu", icon: <Clock4 className="h-5 w-5" />, color: "bg-amber-100 text-amber-800 border-amber-200" },
    { value: "processing", label: "Diproses", icon: <RefreshCw className="h-5 w-5" />, color: "bg-blue-100 text-blue-800 border-blue-200" },
    { value: "completed", label: "Selesai", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-100 text-green-800 border-green-200" },
    { value: "cancelled", label: "Dibatalkan", icon: <XCircle className="h-5 w-5" />, color: "bg-red-100 text-red-800 border-red-200" }
  ];

  const currentStatus = statuses.find(s => s.value === status) || statuses[0];
  
  const handleSubmit = async () => {
    const success = await handleStatusChange();
    if (success) {
      toast.success("Status pesanan berhasil diperbarui");
    } else {
      toast.error("Gagal memperbarui status pesanan");
    }
  };

  const handleQuickChange = async (status) => {
    setSelectedStatus(status);
    const success = await handleStatusChange(status);
    if (success) {
      toast.success("Status pesanan berhasil diperbarui");
    } else {
      toast.error("Gagal memperbarui status pesanan");
    }
  };
  
  return (
    <div className={`bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden`}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          {currentStatus.icon}
          <span className="ml-2">Perbarui Status</span>
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {statuses.map((statusItem) => (
              <button
                key={statusItem.value}
                onClick={() => handleQuickChange(statusItem.value)}
                className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                  selectedStatus === statusItem.value
                    ? `${statusItem.color} border-current ring-2 ring-offset-2 ring-current ring-opacity-30`
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex flex-col items-center">
                  {React.cloneElement(statusItem.icon, { 
                    className: `h-5 w-5 ${selectedStatus === statusItem.value ? 'text-current' : 'text-gray-500'}`
                  })}
                  <span className={`text-sm mt-1 ${selectedStatus === statusItem.value ? 'font-medium' : 'text-gray-700'}`}>
                    {statusItem.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderStatusSection;