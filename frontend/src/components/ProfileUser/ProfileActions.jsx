import React from "react";
import { Edit, LogOut } from "lucide-react";
import { logout } from "../../utils/auth";

const ProfileActions = ({ navigate }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <button
        onClick={() => navigate("/update-profile")}
        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-xl transform hover:-translate-y-1"
      >
        <Edit className="w-5 h-5" />
        <span className="font-semibold">Update Profile</span>
      </button>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-semibold">Logout</span>
      </button>
    </div>
  );
};

export default ProfileActions;
