// src/admin/utils/timeUtils.js

import { format } from "date-fns";
import { id } from "date-fns/locale";

// Format tanggal ke bahasa Indonesia
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    return format(date, "dd MMM yyyy", { locale: id });
  } catch (error) {
    return "Tanggal tidak valid";
  }
};

// Fungsi untuk mengubah milidetik menjadi teks (hari, jam, menit)
export const getTimeDifferenceText = (diffTime) => {
  const days = Math.floor(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (Math.abs(diffTime) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (Math.abs(diffTime) % (1000 * 60 * 60)) / (1000 * 60)
  );
  
  let result = "";
  if (days > 0) result += `${days} hari `;
  if (hours > 0) result += `${hours} jam `;
  if (minutes > 0) result += `${minutes} menit`;
  
  return result.trim() || "0 menit";
};


// Hitung sisa waktu dengan memperhitungkan status order
export const calculateTimeLeft = (deadline, completedAt, status) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);

  if (isNaN(deadlineDate.getTime())) {
    return {
      expired: false,
      text: "Deadline tidak valid",
      color: "text-gray-500",
    };
  }

  // Jika order sudah selesai
  if (status === "completed" && completedAt) {
    const completionDate = new Date(completedAt);
    if (isNaN(completionDate.getTime())) {
      return {
        expired: false,
        text: "Tanggal penyelesaian tidak valid",
        color: "text-gray-500",
      };
    }

    const diffTime = completionDate - deadlineDate;

    // Jika selesai lebih awal
    if (diffTime < 0) {
      return {
        expired: false,
        text: `Terselesaikan ${getTimeDifferenceText(
          Math.abs(diffTime)
        )} lebih awal`,
        color: "text-green-500",
      };
    }
    // Jika selesai tepat waktu (dalam toleransi 1 jam)
    else if (diffTime <= 1000 * 60 * 60) {
      return {
        expired: false,
        text: "Terselesaikan tepat waktu",
        color: "text-green-500",
      };
    }
    // Jika selesai terlambat
    else {
      return {
        expired: true,
        text: `Terlambat ${getTimeDifferenceText(diffTime)}`,
        color: "text-red-500",
      };
    }
  }

  // Untuk order yang belum selesai, hitung waktu yang tersisa
  const diffTime = deadlineDate - now;

  // Jika sudah lewat deadline
  if (diffTime < 0) {
    return {
      expired: true,
      text: `Terlambat ${getTimeDifferenceText(Math.abs(diffTime))}`,
      color: "text-red-500",
    };
  }

  // Jika deadline kurang dari 24 jam
  if (diffTime <= 1000 * 60 * 60 * 24) {
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0 && minutes === 0) {
      return {
        expired: false,
        text: "Deadline saat ini",
        color: "text-yellow-500",
      };
    } else if (hours === 0) {
      return {
        expired: false,
        text: `${minutes} menit lagi`,
        color: "text-yellow-500",
      };
    } else {
      return {
        expired: false,
        text: `${hours} jam ${minutes} menit lagi`,
        color: "text-yellow-500",
      };
    }
  }

  // Jika masih ada beberapa hari
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 1) {
    return { expired: false, text: "Besok", color: "text-blue-500" };
  }

  return {
    expired: false,
    text: `${diffDays} hari lagi`,
    color: "text-blue-500",
  };
};