// OrderDetailComponents/OrderTimelines.jsx
import React from "react";
import { Calendar, Clock } from "lucide-react";
import { formatDateDisplay, formatDeadlineDisplay } from "../../../utils/orderUtils";

const OrderTimelines = ({ deadline, createdAt, updatedAt }) => {
  // Calculate deadline status
  const calculateTimeInfo = (deadline) => {
    if (!deadline) return { color: "text-gray-500", text: "Tidak ada tenggat" };
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffTime < 0) {
      return { color: "text-red-600", text: "Sudah lewat" };
    } else if (diffDays <= 1) {
      return { color: "text-red-600", text: "Hari ini atau besok" };
    } else if (diffDays <= 3) {
      return { color: "text-amber-600", text: `${diffDays} hari lagi` };
    } else {
      return { color: "text-green-600", text: `${diffDays} hari lagi` };
    }
  };
  
  const timeInfo = calculateTimeInfo(deadline);
  
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Tenggat & Waktu
        </h2>
        
        <div className="space-y-4">
          <div className={`bg-gray-50 rounded-lg p-4 border ${timeInfo.color === 'text-red-600' ? 'border-red-100' : 'border-gray-100'}`}>
            <div className={`flex items-center mb-2 ${timeInfo.color}`}>
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Tenggat Waktu</span>
            </div>
            <p className="text-gray-700 font-medium">
              {formatDeadlineDisplay(deadline)}
            </p>
            <div className={`mt-2 flex items-center text-sm ${timeInfo.color}`}>
              <span>{timeInfo.text}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-2 text-blue-600">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Dibuat pada</span>
            </div>
            <p className="text-gray-700">
              {formatDateDisplay(createdAt)}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-2 text-green-600">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Terakhir diperbarui</span>
            </div>
            <p className="text-gray-700">
              {formatDateDisplay(updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimelines;