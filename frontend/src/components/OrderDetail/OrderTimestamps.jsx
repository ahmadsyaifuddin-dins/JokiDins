import React from "react";
import { Clock } from "lucide-react";
import { formatDateDisplay } from "../../utils/orderUtils";

const OrderTimestamps = ({ order }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Clock className="h-4 w-4 mr-2 text-gray-400" />
        Dibuat pada
      </div>
      <p className="font-medium text-gray-800">{formatDateDisplay(order.createdAt)}</p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Clock className="h-4 w-4 mr-2 text-gray-400" />
        Terakhir diperbarui
      </div>
      <p className="font-medium text-gray-800">{formatDateDisplay(order.updatedAt)}</p>
    </div>
  </div>
);

export default OrderTimestamps;
