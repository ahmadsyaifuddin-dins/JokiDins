import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, User, Activity, Calendar, Filter, Search } from "lucide-react";

const UserActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch user activities
        const res = await axios.get(
          `https://jokidins-production.up.railway.app/api/user/activity/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Check if the response is an array, otherwise handle accordingly
        const activitiesData = Array.isArray(res.data) ? res.data : 
                              (res.data.activities ? res.data.activities : []);
        
        setActivities(activitiesData);
        
        // Fetch user details to display name
        try {
          const userRes = await axios.get(
            `https://jokidins-production.up.railway.app/api/user/users/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserName(userRes.data.name || "Pengguna");
        } catch (userErr) {
          console.error("Gagal mengambil data pengguna:", userErr);
          setUserName("Pengguna");
        }
      } catch (err) {
        console.error("Gagal mengambil data aktivitas:", err);
        setError("Gagal mengambil data aktivitas pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [id]);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityTypeClass = (activity) => {
    // You can customize these based on your activity types
    if (activity.description.includes("login")) return "bg-blue-100 border-blue-300";
    if (activity.description.includes("ubah") || activity.description.includes("edit")) return "bg-yellow-100 border-yellow-300";
    if (activity.description.includes("hapus")) return "bg-red-100 border-red-300";
    if (activity.description.includes("tambah") || activity.description.includes("buat")) return "bg-green-100 border-green-300";
    return "bg-gray-100 border-gray-300";
  };

  const getActivityIcon = (activity) => {
    // Customize icons based on activity type
    if (activity.description.includes("login")) return <Activity className="w-5 h-5 text-blue-600" />;
    if (activity.description.includes("ubah") || activity.description.includes("edit")) return <Activity className="w-5 h-5 text-yellow-600" />;
    if (activity.description.includes("hapus")) return <Activity className="w-5 h-5 text-red-600" />;
    if (activity.description.includes("tambah") || activity.description.includes("buat")) return <Activity className="w-5 h-5 text-green-600" />;
    return <Activity className="w-5 h-5 text-gray-600" />;
  };

  // Make sure we have an array before attempting to use filter
  const filteredActivities = Array.isArray(activities) 
    ? activities
        .filter(activity => {
          // Filter by search term
          if (searchTerm && !activity.description.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
          
          // Filter by activity type
          if (filterType === "login" && !activity.description.includes("login")) {
            return false;
          } else if (filterType === "edit" && !(activity.description.includes("ubah") || activity.description.includes("edit"))) {
            return false;
          } else if (filterType === "delete" && !activity.description.includes("hapus")) {
            return false;
          } else if (filterType === "create" && !(activity.description.includes("tambah") || activity.description.includes("buat"))) {
            return false;
          }
          
          return true;
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by newest first
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700">Memuat aktivitas pengguna...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Aktivitas Pengguna</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{userName}</h2>
              <p className="text-gray-500">ID: {id}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari aktivitas..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Semua Aktivitas</option>
                <option value="login">Login</option>
                <option value="edit">Perubahan</option>
                <option value="create">Penambahan</option>
                <option value="delete">Penghapusan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activity List */}
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex flex-col items-center py-8">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">Tidak ada aktivitas yang ditemukan</p>
              <p className="text-gray-500 mt-2">
                {searchTerm || filterType !== "all" 
                  ? "Coba ubah filter atau kata kunci pencarian" 
                  : "Pengguna ini belum memiliki aktivitas yang tercatat"}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Riwayat Aktivitas ({filteredActivities.length})</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredActivities.map((activity, index) => (
                <li 
                  key={activity._id || index} 
                  className={`p-4 hover:bg-gray-50 transition ${getActivityTypeClass(activity)} border-l-4`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getActivityIcon(activity)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDateTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivity;