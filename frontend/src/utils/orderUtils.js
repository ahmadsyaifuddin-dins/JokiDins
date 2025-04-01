// src/utils/orderUtils.js
import { format, addHours } from "date-fns";
import { id } from "date-fns/locale";
import axios from "axios";
import { API_BASE_URL } from '../config';

// Untuk createdAt & updatedAt: Tampilkan dengan timezone WITA menggunakan Intl.DateTimeFormat
export const formatDateDisplay = (dateString) => {
  try {
    if (!dateString) return "Data tidak tersedia";
    const date = new Date(dateString);
    const witaOptions = {
      timeZone: "Asia/Makassar",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("id-ID", witaOptions).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Format tanggal tidak valid";
  }
};

// Untuk deadline: Tampilkan apa adanya sesuai input user (menggunakan getter UTC)
export const formatDeadlineDisplay = (dateString) => {
  try {
    if (!dateString) return "Tidak ada deadline";
    const originalDate = new Date(dateString);
    const day = originalDate.getUTCDate().toString().padStart(2, "0");
    const month = format(new Date(0, originalDate.getUTCMonth()), "MMM", { locale: id });
    const year = originalDate.getUTCFullYear();
    const hours = originalDate.getUTCHours().toString().padStart(2, "0");
    const minutes = originalDate.getUTCMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting deadline:", error);
    return "Format deadline tidak valid";
  }
};

/**
 * Menghitung selisih waktu antara sekarang dan tenggat waktu
 * @param {string|Date} deadline - Tenggat waktu dalam format ISO string atau objek Date
 * @param {number} timezoneOffset - Offset zona waktu dalam jam (default: -8 untuk WITA)
 * @returns {Object} Objek berisi text dan color untuk tampilan
 */
export const getTimeDifference = (deadline, timezoneOffset = -8) => {
  // Handler jika tidak ada tenggat
  if (!deadline) return { text: "Tidak ada tenggat", color: "text-gray-600" };
  
  const now = new Date();
  const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline);
  
  // Validasi deadline
  if (isNaN(deadlineDate.getTime())) {
    return { text: "Format tenggat tidak valid", color: "text-gray-600" };
  }
  
  // Koreksi timezone
  const deadlineLocal = new Date(deadlineDate.getTime() + (timezoneOffset * 60 * 60 * 1000));
  const diffTime = deadlineLocal - now;
  
  // Format output dengan lebih rapi
  const formatTimeDiff = (timeDiff, isLate = false) => {
    const absTimeDiff = Math.abs(timeDiff);
    const days = Math.floor(absTimeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absTimeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Tampilkan hanya unit waktu yang relevan
    let result = "";
    if (days > 0) {
      result += `${days} hari`;
      if (hours > 0 || minutes > 0) result += ", ";
    }
    if (hours > 0) {
      result += `${hours} jam`;
      if (minutes > 0) result += " ";
    }
    if (minutes > 0 || (days === 0 && hours === 0)) {
      result += `${minutes} menit`;
    }
    
    // Tambah label sesuai kondisi
    if (isLate) {
      return `Terlambat ${result}`;
    } else if (days === 0) {
      return `Hari ini, ${result} lagi`;
    } else if (days === 1) {
      return `Besok, ${result} lagi`;
    } else {
      return `${result} lagi`;
    }
  };
  
  // Tentukan status dan warna berdasarkan selisih waktu
  if (diffTime < 0) {
    return { 
      text: formatTimeDiff(diffTime, true), 
      color: "text-red-600" 
    };
  } else if (diffTime <= 86400000 * 1) { // 1 hari dalam milidetik
    return { 
      text: formatTimeDiff(diffTime), 
      color: "text-amber-600" 
    };
  } else if (diffTime <= 86400000 * 3) { // 3 hari dalam milidetik
    return { 
      text: formatTimeDiff(diffTime), 
      color: "text-amber-600" 
    };
  } else {
    return { 
      text: formatTimeDiff(diffTime), 
      color: "text-green-600" 
    };
  }
};

const TOLERANCE_MS = 5 * 60 * 1000;
export const getCompletionTimeDifference = (order) => {
  // Jika pesanan belum selesai, gunakan perhitungan getTimeDifference
  if (!order.completedAt) {
    return getTimeDifference(order.deadline);
  } else {
    // Untuk pesanan selesai, kita koreksi deadline dan completedAt
    // Deadline harus dikoreksi dengan mengurangi 8 jam agar mewakili waktu WITA input
    const deadlineLocal = addHours(new Date(order.deadline), -8);
    // completedAt merupakan timestamp sistem yang sudah benar (ditampilkan sebagai waktu lokal)
    const completedLocal = new Date(order.completedAt);
    const diffTime = deadlineLocal - completedLocal; // positif: selesai lebih awal; negatif: terlambat
    
    if (Math.abs(diffTime) < TOLERANCE_MS) {
      return { text: "Tepat waktu", color: "text-green-600" };
    } else if (diffTime > 0) {
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      let text = "Terselesaikan lebih awal";
      if (days > 0) text += ` ${days} hari`;
      if (hours > 0) text += ` ${hours} jam`;
      if (minutes > 0) text += ` ${minutes} menit`;
      return { text, color: "text-green-600" };
    } else {
      const absDiff = Math.abs(diffTime);
      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
      let text = "Terlambat";
      if (days > 0) text += ` ${days} hari`;
      if (hours > 0) text += ` ${hours} jam`;
      if (minutes > 0) text += ` ${minutes} menit`;
      return { text, color: "text-red-600" };
    }
  }
};


/**
 * Cek status Telegram berdasarkan profile user.
 * @param {string} token - JWT token.
 * @returns {Promise<boolean>}
 */
export const checkTelegramStatus = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return !!res.data.telegramChatId;
  } catch (error) {
    console.error("Gagal mengecek status Telegram:", error);
    return false;
  }
};

/**
 * Kirim order dengan data FormData.
 * @param {FormData} formData - Data order.
 * @param {string} token - JWT token.
 * @returns {Promise}
 */
export const submitOrder = async (formData, token) => {
  return axios.post(`${API_BASE_URL}/api/orders`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
