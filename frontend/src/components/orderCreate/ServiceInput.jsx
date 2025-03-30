import React from 'react';
import { FileText } from 'lucide-react';

const ServiceInput = ({ service, setService }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="service"
        className="flex items-center text-sm font-medium text-gray-700"
      >
        <FileText className="h-4 w-4 mr-2 text-blue-600" />
        Joki Apa
      </label>
      <input
        id="service"
        type="text"
        placeholder="Bikin PPT, Bikin Aplikasi Web, dll"
        value={service}
        onChange={(e) => setService(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
    </div>
  );
};

export default ServiceInput;