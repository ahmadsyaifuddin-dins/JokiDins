// utils/orderUtils.js
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export const formatDateDisplay = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, "dd MMM yyyy, HH:mm", { locale: id });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const getTimeDifference = (deadline) => {
  const now = new Date();
  const deadlineDate = parseISO(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Terlambat", color: "text-red-600" };
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

const TOLERANCE_MS = 5 * 60 * 1000;
export const getCompletionTimeDifference = (order) => {
  if (!order.completedAt) {
    // Order belum selesai, gunakan info deadline terhadap waktu sekarang
    const now = new Date();
    const deadlineDate = parseISO(order.deadline);
    const diffTime = deadlineDate - now;
    if (diffTime < 0) {
      return { text: "Terlambat", color: "text-red-600" };
    } else if (diffTime < TOLERANCE_MS) {
      return { text: "Hari ini", color: "text-amber-600" };
    } else {
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return {
        text: `${diffDays} hari lagi`,
        color: diffDays <= 3 ? "text-amber-600" : "text-green-600",
      };
    }
  } else {
    // Order sudah selesai, bandingkan completedAt dengan deadline
    const deadlineDate = parseISO(order.deadline);
    const completedDate = parseISO(order.completedAt);
    const diffTime = deadlineDate - completedDate; // positif: selesai lebih awal; negatif: terlambat
    if (Math.abs(diffTime) < TOLERANCE_MS) {
      return { text: "Tepat waktu", color: "text-green-600" };
    } else if (diffTime > 0) {
      // Selesai lebih awal
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      let text = "Terselesaikan lebih awal";
      if (days > 0) text += ` ${days} hari`;
      if (hours > 0) text += ` ${hours} jam`;
      if (minutes > 0) text += ` ${minutes} menit`;
      return { text, color: "text-green-600" };
    } else {
      // Selesai terlambat
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
