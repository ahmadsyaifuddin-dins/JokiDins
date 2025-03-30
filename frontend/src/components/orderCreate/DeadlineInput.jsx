import React from 'react';
import { Calendar } from 'lucide-react';

const DeadlineInput = ({ deadline, setDeadline }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="deadline"
        className="flex items-center text-sm font-medium text-gray-700"
      >
        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
        Deadline (Tanggal & Waktu)
      </label>
      <input
        id="deadline"
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
    </div>
  );
};

export default DeadlineInput;