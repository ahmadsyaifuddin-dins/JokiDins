import React from "react";
import { Phone } from "lucide-react";

const PhoneInput = ({
  savedPhones,
  selectedPhoneOption,
  setSelectedPhoneOption,
  phone,
  handlePhoneInputChange,
  provider,
  providerColors,
  detectProvider,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="phone"
        className="flex items-center text-sm font-medium text-gray-700"
      >
        <Phone className="h-4 w-4 mr-2 text-blue-600" />
        Nomor HP / WA / Telegram Aktif
      </label>

      {savedPhones.length > 0 && (
        <div className="relative">
          <select
            value={selectedPhoneOption}
            onChange={(e) => setSelectedPhoneOption(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   outline-none transition-colors appearance-none"
          >
            <option value="new"> Input Nomor Baru </option>
            {savedPhones.map((num, idx) => (
              <option key={idx} value={num}>
                {num} ({detectProvider(num)})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {selectedPhoneOption === "new" && (
        <div className="space-y-2">
          <div className="relative">
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="Contoh: 08123456789"
              value={phone}
              onChange={handlePhoneInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-colors"
            />
          </div>
          <p className="text-xs text-gray-500 italic">
            Disarankan nomor tersebut aktif di telegram supaya dapat informasi realtime
          </p>
          {phone && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Provider:</span>
              <span className={`text-sm font-medium ml-2 ${providerColors[provider]}`}>
                {provider}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneInput;