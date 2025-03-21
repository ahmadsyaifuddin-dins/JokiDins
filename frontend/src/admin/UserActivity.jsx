import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

const UserActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        // Pastikan kamu sudah menambahkan route ini di backend
        const res = await axios.get(
          `https://jokidins-production.up.railway.app/api/user/activity/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActivities(res.data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Memuat aktivitas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-4 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali</span>
      </button>
      <h1 className="text-2xl font-bold mb-4">Aktivitas Pengguna</h1>
      {activities.length === 0 ? (
        <p className="text-gray-600">Tidak ada aktivitas untuk pengguna ini.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity._id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {formatDateTime(activity.timestamp)}
                </span>
              </div>
              <p className="mt-2">{activity.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserActivity;
