import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faToggleOn, 
  faToggleOff, 
  faTrash, 
  faPhone 
} from "@fortawesome/free-solid-svg-icons";

const Table = ({
  filteredUsers,
  requestSort,
  sortConfig,
  handleDetail,
  handleDisable,
  handleEnable,
  handleDelete
}) => {
  const renderSortIcon = (key) => {
    const isSorted = sortConfig.key === key;
    return (
      <svg
        className={`w-4 h-4 ml-1 ${
          isSorted
            ? "text-blue-600"
            : "text-gray-400 group-hover:text-gray-600"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={
            isSorted && sortConfig.direction === "descending"
              ? "M7 11l5 5 5-5M7 6l5 5 5-5"
              : "M7 16l5-5 5 5M7 11l5-5 5 5"
          }
        ></path>
      </svg>
    );
  };

  const getRoleClass = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-amber-100 text-amber-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (filteredUsers.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 font-medium mb-2">
          Tidak ada data pengguna yang ditemukan
        </div>
        <p className="text-gray-400 text-sm">
          Coba ubah filter pencarian atau tambahkan pengguna baru
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 font-semibold">#</th>
            <th className="py-3 px-4 font-semibold">Avatar</th>
            <th
              className="py-3 px-4 font-semibold cursor-pointer group"
              onClick={() => requestSort("name")}
            >
              <div className="flex items-center">
                Nama
                {renderSortIcon("name")}
              </div>
            </th>
            <th
              className="py-3 px-4 font-semibold cursor-pointer group"
              onClick={() => requestSort("email")}
            >
              <div className="flex items-center">
                Email
                {renderSortIcon("email")}
              </div>
            </th>
            <th className="py-3 px-4 font-semibold">Nomor HP</th>
            <th
              className="py-3 px-4 font-semibold cursor-pointer group"
              onClick={() => requestSort("role")}
            >
              <div className="flex items-center">
                Role
                {renderSortIcon("role")}
              </div>
            </th>
            <th className="py-3 px-4 font-semibold text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user._id}
              className="border-b last:border-none hover:bg-blue-50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-600">{index + 1}</td>
              <td className="py-3 px-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </td>
              <td className="py-3 px-4 font-medium">{user.name}</td>
              <td className="py-3 px-4 text-gray-600">{user.email}</td>
              <td className="py-3 px-4 text-gray-600">
                {user.phones && user.phones.length > 0 ? (
                  user.phones.map((phone, i) => (
                    <div key={i} className="flex items-center">
                      <FontAwesomeIcon 
                        icon={faPhone} 
                        className="text-gray-400 mr-1" 
                      />
                      {phone}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 italic">
                    Tidak Tersedia
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleClass(user.role)}`}
                >
                  {user.role === "user" ? "Kostumer" : user.role}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleDetail(user._id)}
                    className="bg-transparent text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors"
                    title="Lihat Detail"
                  >
                    <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
                  </button>
                  {user.is_active ? (
                    <button
                      onClick={() => handleDisable(user._id)}
                      className="bg-transparent text-green-600 hover:bg-green-100 p-2 rounded-full transition-colors"
                      title="Nonaktifkan Akun"
                    >
                      <FontAwesomeIcon icon={faToggleOn} className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnable(user._id)}
                      className="bg-transparent text-yellow-600 hover:bg-yellow-100 p-2 rounded-full transition-colors"
                      title="Aktifkan Akun"
                    >
                      <FontAwesomeIcon icon={faToggleOff} className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-transparent text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors"
                    title="Hapus Pengguna"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;