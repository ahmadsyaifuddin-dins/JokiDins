// src/hooks/useSavedPhones.js
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from '../../config';

export const useSavedPhones = () => {
  const [savedPhones, setSavedPhones] = useState([]);

  useEffect(() => {
    const fetchPhones = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user/phones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedPhones(res.data);
      } catch (error) {
        if (!(error.response && [401, 403].includes(error.response.status))) {
          console.error("Gagal ambil nomor HP tersimpan:", error);
          toast.error("Gagal memuat nomor HP tersimpan");
        }
      }
    };
    fetchPhones();
  }, []);

  return savedPhones;
};
