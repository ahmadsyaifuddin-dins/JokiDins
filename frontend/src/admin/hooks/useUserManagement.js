import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/user/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      setError("Tidak dapat memuat data pengguna.");
    } finally {
      setLoading(false);
      setIsInitialLoad(false); // Set false setelah load pertama
    }
  };

  const applyFilters = () => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phones &&
            user.phones.some((phone) => phone.includes(searchTerm)))
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = await Swal.fire({
      title: "Hapus akun pengguna?",
      text: "Anda tidak dapat mengembalikan akun pengguna ini setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/user/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Akun pengguna berhasil dihapus.");
      fetchUsers();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Akun pengguna tidak ditemukan.");
      } else if (err.response && err.response.status === 400) {
        toast.error("Admin tidak dapat menghapus akun sendiri.");
      } else {
        console.error("Gagal menghapus Akun:", err);
        toast.error("Gagal menghapus Akun. Silakan coba lagi.");
      }
    }
  };

  const handleDisable = async (userId) => {
    const confirmDisable = await Swal.fire({
      title: "Nonaktifkan akun pengguna?",
      text: "Pengguna tidak akan bisa login setelah dinonaktifkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Nonaktifkan",
    });

    if (!confirmDisable.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/users/${userId}/disable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dynamicSuspendTime = res.data.suspendDuration; 
      toast.success(`Akun pengguna dinonaktifkan selama ${dynamicSuspendTime} hari.`); 
      fetchUsers();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Akun pengguna tidak ditemukan.");
      } else if (err.response && err.response.status === 400) {
        toast.error("Anda tidak dapat menonaktifkan diri sendiri.");
      } else {
        console.error("Gagal menonaktifkan user:", err);
        toast.error("Gagal menonaktifkan user. Silakan coba lagi.");
      }
    }
  };

  const handleEnable = async (userId) => {
    const confirmEnable = await Swal.fire({
      title: "Aktifkan akun pengguna?",
      text: "Pengguna akan bisa login kembali setelah diaktifkan!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aktifkan",
    });

    if (!confirmEnable.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/admin/users/${userId}/enable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Akun pengguna berhasil diaktifkan.");
      fetchUsers();
    } catch (err) {
      console.error("Gagal mengaktifkan user:", err);
      toast.error("Gagal mengaktifkan user.");
    }
  };

  const handleBlock = async (userId) => {
    // Tampilkan konfirmasi misalnya pakai Swal
    const confirmBlock = await Swal.fire({
      title: "Blokir akun pengguna?",
      text: "Pengguna akan diblokir dan tidak bisa login lagi sampai admin membuka blokirnya.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Blokir",
    });
    if (!confirmBlock.isConfirmed) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/admin/users/${userId}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Akun pengguna berhasil diblokir.");
      fetchUsers();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Akun pengguna tidak ditemukan.");
      } else if (err.response && err.response.status === 400) {
        toast.error("Anda tidak dapat memblokir diri sendiri.");
      } else {
        console.error("Gagal memblokir user:", err);
        toast.error("Gagal memblokir user. Silakan coba lagi.");
      }
    }
  };
  
  const handleUnblock = async (userId) => {
    const confirmUnblock = await Swal.fire({
      title: "Buka blokir akun pengguna?",
      text: "Pengguna akan bisa login kembali setelah blokir dibuka.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Buka Blokir",
    });
    if (!confirmUnblock.isConfirmed) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/admin/users/${userId}/unblock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Blokir akun berhasil dibuka.");
      fetchUsers();
    } catch (err) {
      console.error("Gagal membuka blokir user:", err);
      toast.error("Gagal membuka blokir akun. Silakan coba lagi.");
    }
  };
  

  const handleDetail = (userId) => {
    navigate(`/admin/userDetail/${userId}`);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return {
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
    handleBlock,
    handleUnblock,
    handleDetail,
    isInitialLoad // optional: return isInitialLoad kalau dibutuhkan di parent
  };
};
