// src/hooks/useUserProfile.js
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from '../../config';

export const useUserProfile = () => {
  const [isTelegramLinked, setIsTelegramLinked] = useState(false);
  const [isCheckingTelegram, setIsCheckingTelegram] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsCheckingTelegram(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsTelegramLinked(!!res.data.telegramChatId);
      } catch (error) {
        console.error("Gagal mengambil profile:", error);
      } finally {
        setIsCheckingTelegram(false);
      }
    };
    fetchProfile();
  }, []);

  return { isTelegramLinked, isCheckingTelegram };
};
