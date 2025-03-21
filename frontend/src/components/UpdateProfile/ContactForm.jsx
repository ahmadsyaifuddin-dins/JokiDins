import React from "react";
import {
  Phone,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

const ContactForm = ({
  savedPhones,
  selectedPhoneOption,
  setSelectedPhoneOption,
  phoneInput,
  setPhoneInput,
  handleRemovePhone,
  togglePhoneList,
  isPhoneListOpen,
  isDeleting,
  handlePhoneOptionChange,
}) => {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Tambahkan nomor telepon untuk meningkatkan keamanan akun Anda
            </p>
          </div>
        </div>
      </div>

      {/* List Nomor Telepon */}
      {savedPhones.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={togglePhoneList}
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {savedPhones.length} Nomor Tersimpan
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Kelola semua nomor telepon Anda
                </p>
              </div>
            </div>
            {isPhoneListOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <div
            className={`transition-all overflow-hidden ${
              isPhoneListOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 space-y-3 bg-white">
              {savedPhones.map((phone, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-200 p-2 rounded-full mr-3">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium">{phone}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhoneOption(phone);
                        setPhoneInput(phone);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit nomor"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(phone)}
                      disabled={isDeleting}
                      className={`text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors ${
                        isDeleting
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title="Hapus nomor"
                    >
                      {isDeleting ? (
                        <svg
                          className="animate-spin h-4 w-4 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input dan Select untuk Nomor Telepon */}
      {savedPhones.length > 0 && (
        <div className="space-y-2">
          <label className="flex text-sm font-medium text-gray-700">
            Pilih Aksi
          </label>
          <div className="relative rounded-lg shadow-sm">
            <select
              value={selectedPhoneOption}
              onChange={handlePhoneOptionChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="new">Input Nomor Baru</option>
              {savedPhones.map((p, idx) => (
                <option key={idx} value={p}>
                  Edit: {p}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {selectedPhoneOption === "new" ? (
                <Phone className="h-5 w-5 text-gray-400" />
              ) : (
                <Edit className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="flex text-sm font-medium text-gray-700 items-center">
          <Phone className="h-4 w-4 mr-2 text-blue-600" />
          {selectedPhoneOption === "new"
            ? "Nomor Telepon Baru"
            : "Edit Nomor Telepon"}
        </label>
        <div className="relative rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Nomor HP harus diawali 0"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-1">
          Contoh: 081234567890
        </p>
      </div>
    </div>
  );
};

export default ContactForm;
