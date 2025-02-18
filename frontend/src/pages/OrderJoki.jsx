import { useEffect, useState } from "react";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const OrderJoki = () => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ task, description, file });
    alert("Pesanan berhasil dibuat!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Buat Pesanan Joki</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-md">
        <label className="block mb-2">
          Jenis Joki:
          <select className="border p-2 w-full mt-1" value={task} onChange={(e) => setTask(e.target.value)} required>
            <option value="">Pilih Jenis Joki</option>
            <option value="Website">Pembuatan Website</option>
            <option value="Tugas Kuliah">Tugas Kuliah</option>
            <option value="Tugas Algoritma">Tugas Algoritma</option>
            <option value="Tugas JST">Tugas Jaringan Syaraf Tiruan</option>
            <option value="Tugas Bikin Makalah">Bikin Makalah</option>
            <option value="Tugas Bikin PPT">Bikin PPT</option>
            <option value="Desain Grafis">Desain Grafis</option>
          </select>
        </label>

        <label className="block mb-2">
          Deskripsi Tugas:
          <textarea className="border p-2 w-full mt-1" rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </label>

        <label className="block mb-4">
          Upload File (Opsional):
          <input type="file" className="border p-2 w-full mt-1" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded-md w-auto">
          Kirim Pesanan
        </button>
      </form>
    </div>
  );
};

export default OrderJoki;
