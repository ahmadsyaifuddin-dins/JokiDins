// src/admin/utils/timeUtils.js
import { format, addHours } from "date-fns";
import { id } from "date-fns/locale";

// Format tanggal untuk createdAt dan updatedAt dengan timezone WITA
export const formatDate = (dateString) => {
  try {
    if (!dateString) return "Data tidak tersedia";
    
    const date = new Date(dateString);
    // Gunakan Intl.DateTimeFormat dengan zona waktu Asia/Makassar (WITA)
    const witaOptions = {
      timeZone: 'Asia/Makassar',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return new Intl.DateTimeFormat('id-ID', witaOptions).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Format tanggal tidak valid";
  }
};

// Format deadline sesuai dengan nilai UTC aslinya (agar tampil sesuai input user)
export const formatDeadline = (dateString) => {
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

// Hitung waktu tersisa hingga deadline (atau selisih waktu selesai)
export const calculateTimeLeft = (deadline, completedAt, status) => {
  const TOLERANCE_MS = 5 * 60 * 1000; // 5 menit toleransi
  
  // Jika status completed atau cancelled, tidak perlu menghitung countdown
  if (status === "completed") {
    return { text: "Selesai", color: "text-green-600" };
  }
  if (status === "cancelled") {
    return { text: "Dibatalkan", color: "text-red-600" };
  }
  
  // Jika tidak ada deadline
  if (!deadline) {
    return { text: "Tidak ada tenggat", color: "text-gray-500" };
  }
  
  // Untuk perhitungan, kita koreksi deadline:
  // Karena input deadline dianggap WITA tapi disimpan sebagai UTC,
  // kita kurangi 8 jam agar deadline untuk perhitungan sesuai dengan waktu WITA.
  const deadlineLocal = addHours(new Date(deadline), -8);
  
  // Jika pesanan sudah selesai, hitung apakah tepat waktu atau tidak
  if (completedAt) {
    const completedLocal = new Date(completedAt); // Anggap ini sudah dalam waktu lokal (WITA)
    const diffTime = deadlineLocal - completedLocal; // positif: selesai lebih awal; negatif: terlambat
    
    if (Math.abs(diffTime) < TOLERANCE_MS) {
      return { text: "Tepat waktu", color: "text-green-600" };
    } else if (diffTime > 0) {
      // Selesai lebih awal
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      
      let text = "Lebih awal";
      if (days > 0) text += ` ${days}hari`;
      if (hours > 0) text += ` ${hours}jam`;
      if (minutes > 0 && days === 0) text += ` ${minutes}m`;
      
      return { text, color: "text-green-600" };
    } else {
      // Terlambat
      const absDiff = Math.abs(diffTime);
      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      let text = "Terlambat";
      if (days > 0) text += ` ${days}hari`;
      if (hours > 0 && days === 0) text += ` ${hours}jam`;
      if (minutes > 0 && days === 0 && hours === 0) text += ` ${minutes}m`;
      
      return { text, color: "text-red-600" };
    }
  }
  
  // Untuk pesanan yang belum selesai, hitung waktu tersisa
  const now = new Date();
  const diffTime = deadlineLocal - now;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffTime < 0) {
    // Sudah lewat deadline
    const absDiff = Math.abs(diffTime);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let text = "Terlambat";
    if (days > 0 && hours > 0) text += ` ${days} hari ${hours} jam`;
    else if (days > 0) text += ` ${days} hari`;
    else if (hours > 0) text += ` ${hours} jam`;
    
    return { text, color: "text-red-600" };
  } else if (diffDays === 0 && diffHours < 24) {
    return { text: `${diffHours} jam lagi`, color: "text-amber-600" };
  } else if (diffDays === 0) {
    return { text: "Hari ini", color: "text-amber-600" };
  } else if (diffDays === 1) {
    return { text: "Besok", color: "text-amber-600" };
  } else if (diffDays <= 3) {
    return { text: `${diffDays} hari lagi`, color: "text-amber-600" };
  } else {
    return { text: `${diffDays} hari lagi`, color: "text-green-600" };
  }
};
