import React from "react";
import { User, Mail, Calendar, VenusAndMarsIcon, ChevronDown } from "lucide-react";

const BasicForm = ({
  name,
  setName,
  email,
  birthday,
  setBirthday,
  gender,
  setGender,
}) => {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Nama Lengkap */}
      <div className="space-y-2">
        <label className="flex text-sm font-medium text-gray-700 items-center">
          <User className="h-4 w-4 mr-2 text-blue-600" />
          Nama Lengkap
        </label>
        <div className="relative rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Masukkan nama lengkap"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="flex text-sm font-medium text-gray-700 items-center">
          <Mail className="h-4 w-4 mr-2 text-blue-600" />
          Email
        </label>
        <div className="relative rounded-lg shadow-sm">
          <input
            type="email"
            placeholder="Masukkan email"
            className="w-full p-3 pl-10 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={email}
            readOnly
            required
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tanggal Lahir dan Jenis Kelamin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tanggal Lahir */}
        <div className="space-y-2">
          <label className="flex text-sm font-medium text-gray-700 items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
            Tanggal Lahir
          </label>
          <div className="relative rounded-lg shadow-sm">
            <input
              type="date"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Jenis Kelamin */}
        <div className="space-y-2">
          <label className="flex text-sm font-medium text-gray-700 items-center">
            <VenusAndMarsIcon className="h-4 w-4 mr-2 text-blue-600" />
            Jenis Kelamin
          </label>
          <div className="relative rounded-lg shadow-sm">
            <select
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <VenusAndMarsIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicForm;
