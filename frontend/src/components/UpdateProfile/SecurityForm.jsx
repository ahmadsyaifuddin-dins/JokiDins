import React from "react";
import { Lock, AlertCircle } from "lucide-react";

const SecurityForm = ({ password, setPassword }) => {
  // Fungsi helper untuk menentukan lebar dan warna bar kekuatan password
  const getPasswordStrengthClass = () => {
    if (!password) return "w-0";
    if (password.length < 6) return "w-1/4 bg-red-500";
    if (password.length < 8) return "w-1/2 bg-amber-500";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "w-full bg-green-500";
    return "w-3/4 bg-blue-500";
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-5">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              Ubah password secara berkala untuk meningkatkan keamanan akun Anda
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex text-sm font-medium text-gray-700 items-center">
          <Lock className="h-4 w-4 mr-2 text-blue-600" />
          Password Baru
        </label>
        <div className="relative rounded-lg shadow-sm">
          <input
            type="password"
            placeholder="Masukkan password baru (opsional)"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <AlertCircle className="h-4 w-4 mr-1 text-gray-400" />
          <p>Biarkan kosong jika tidak ingin mengubah password</p>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Kekuatan Password
          </h3>
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${getPasswordStrengthClass()}`}></div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            <p className={`text-xs ${password && password.length > 0 ? "text-gray-900" : "text-gray-400"}`}>
              Lemah
            </p>
            <p className={`text-xs ${password && password.length >= 6 ? "text-gray-900" : "text-gray-400"}`}>
              Sedang
            </p>
            <p className={`text-xs ${password && password.length >= 8 ? "text-gray-900" : "text-gray-400"}`}>
              Kuat
            </p>
            <p className={`text-xs ${
              password &&
              password.length >= 8 &&
              /[A-Z]/.test(password) &&
              /[0-9]/.test(password)
                ? "text-gray-900"
                : "text-gray-400"
            }`}>
              Sangat Kuat
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-600">
          <p className="font-medium mb-2">Rekomendasi:</p>
          <ul className="space-y-1 list-disc pl-5">
            <li className={password.length >= 8 ? "text-green-600" : ""}>
              Minimal 8 karakter
            </li>
            <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
              Minimal 1 huruf kapital
            </li>
            <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
              Minimal 1 angka
            </li>
            <li className={/[!@#$%^&*]/.test(password) ? "text-green-600" : ""}>
              Minimal 1 karakter khusus (!@#$%^&*)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecurityForm;
