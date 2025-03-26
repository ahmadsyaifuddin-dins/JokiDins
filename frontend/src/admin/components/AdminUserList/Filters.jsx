import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSync, faUsers } from "@fortawesome/free-solid-svg-icons";

const Filters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  fetchUsers,
  totalUsers
}) => {
  return (
    <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {/* Search box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama, email, nomor HP..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-3 text-gray-500" 
          />
        </div>

        {/* Role filter */}
        <select
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Semua Role</option>
          <option value="user">Kostumer</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <div className="flex justify-between md:justify-end space-x-2">
        <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center">
          <FontAwesomeIcon icon={faUsers} className="mr-1" />
          Total: {totalUsers}
        </span>
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition flex items-center"
        >
          <FontAwesomeIcon icon={faSync} className="mr-1" />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Filters;