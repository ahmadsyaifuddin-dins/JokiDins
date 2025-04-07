// OrderDetailComponents/OrderDangerZone.jsx
import React from "react";
import { AlertTriangle, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const OrderDangerZone = ({ handleDelete }) => {
  const confirmDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus pesanan?",
      text: "Anda tidak dapat mengembalikan pesanan ini setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const success = await handleDelete();
      if (success) {
        toast.success("Pesanan berhasil dihapus");
      } else {
        toast.error("Gagal menghapus pesanan");
      }
    }
  };

  return (
    <div className="bg-red-50 rounded-2xl shadow-md border border-red-100 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Tindakan Berbahaya
        </h2>
        <p className="text-red-600 mb-4 text-sm">
          Perhatian: Tindakan ini tidak dapat dikembalikan dan akan menghapus pesanan secara permanen.
        </p>
        <button
          onClick={confirmDelete}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Hapus Pesanan
        </button>
      </div>
    </div>
  );
};

export default OrderDangerZone;