import React from "react";
import { Calendar } from "lucide-react";
import { formatDeadlineDisplay } from "../../utils/orderUtils";

const OrderDeadline = ({ deadline }) => (
  <div className="transition-all hover:shadow-md rounded-xl">
    <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
      <span className="inline-block w-1 h-4 bg-amber-500 mr-2 rounded"></span>
      Tenggat Waktu
    </h2>
    <div className="flex items-center text-gray-600 bg-amber-50 rounded-xl p-4 border border-amber-100">
      <Calendar className="h-5 w-5 mr-3 text-amber-500" />
      <div>
        <span className="font-medium">{formatDeadlineDisplay(deadline)}</span>
      </div>
    </div>
  </div>
);

export default OrderDeadline;
