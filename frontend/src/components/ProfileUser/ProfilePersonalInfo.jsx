import React from "react";
import { User, Mail, Phone, Edit, VenusAndMars, Cake } from "lucide-react";

const ProfilePersonalInfo = ({ profile, formatDate, navigate }) => {
  return (
    <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Informasi Pribadi
        </h3>
        <button
          onClick={() => navigate("/update-profile")}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </button>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-start border-b border-gray-100 pb-4">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-800 font-medium truncate">{profile.email}</p>
          </div>
        </div>

        {/* Phone Numbers */}
        <div className="flex items-start border-b border-gray-100 pb-4">
          <div className="bg-amber-100 p-3 rounded-lg mr-4">
            <Phone className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Nomor HP Tersimpan</p>
            {profile.phones && profile.phones.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.phones.map((p, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm">
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">Belum ada nomor HP tersimpan</p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="flex items-start border-b border-gray-100 pb-4">
          <div className="bg-purple-100 p-3 rounded-lg mr-4">
            <VenusAndMars className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Jenis Kelamin</p>
            <p className="text-gray-800 font-medium">{profile.gender || "Belum disetel"}</p>
          </div>
        </div>

        {/* Birthday */}
        <div className="flex items-start">
          <div className="bg-pink-100 p-3 rounded-lg mr-4">
            <Cake className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Tanggal Lahir</p>
            <p className="text-gray-800 font-medium">
              {profile.birthday ? formatDate(profile.birthday) : "Belum disetel"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
