import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faToggleOn, 
  faToggleOff, 
  faTrash, 
  faSync, 
  faSearch, 
  faUsers 
} from "@fortawesome/free-solid-svg-icons";

import UserListHeader from "./components/AdminUserList/Header";
import UserListFilters from "./components/AdminUserList/Filters";
import UserListTable from "./components/AdminUserList/Table";
import UserListPagination from "./components/AdminUserList/Pagination";
import { useUserManagement } from "./hooks/useUserManagement";

const AdminUserList = () => {
  const navigate = useNavigate();
  const {
    users,
    filteredUsers,
    loading,
    error,
    searchTerm,
    roleFilter,
    sortConfig,
    setSearchTerm,
    setRoleFilter,
    requestSort,
    fetchUsers,
    handleDelete,
    handleDisable,
    handleEnable,
    handleDetail
  } = useUserManagement();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg inline-block shadow-md">
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-white">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <UserListHeader />
        
        <UserListFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          fetchUsers={fetchUsers}
          totalUsers={filteredUsers.length}
        />

        <UserListTable
          filteredUsers={filteredUsers}
          requestSort={requestSort}
          sortConfig={sortConfig}
          handleDetail={handleDetail}
          handleDisable={handleDisable}
          handleEnable={handleEnable}
          handleDelete={handleDelete}
        />

        <UserListPagination
          filteredUsers={filteredUsers}
          totalUsers={users.length}
        />
      </div>
    </div>
  );
};

export default AdminUserList;