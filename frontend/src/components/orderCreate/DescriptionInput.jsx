import React from 'react';
import { FileText } from 'lucide-react';

const DescriptionInput = ({ description, setDescription }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="description"
        className="flex items-center text-sm font-medium text-gray-700"
      >
        <FileText className="h-4 w-4 mr-2 text-blue-600" />
        Deskripsi Joki
      </label>
      <textarea
        id="description"
        placeholder="Jelaskan detail kebutuhan anda"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
      />
    </div>
  );
};

export default DescriptionInput;