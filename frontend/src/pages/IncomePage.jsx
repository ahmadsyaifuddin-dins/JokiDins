import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import IncomeChart from "../components/IncomePage/IncomeChart";
import IncomeBarChart from "../components/IncomePage/IncomeBarChart";
import IncomeForm from "../components/IncomePage/IncomeForm";
import IncomeFilter from "../components/IncomePage/IncomeFilter";
import IncomeTotal from "../components/IncomePage/IncomeTotal";
import IncomeTable from "../components/IncomePage/IncomeTable";
import IncomeExport from "../components/IncomePage/IncomeExport";

const IncomePage = () => {
  // State untuk form input
  const [nominal, setNominal] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State untuk data history (langsung dari backend)
  const [historyData, setHistoryData] = useState([]);

  // State untuk loading dan error saat fetch data
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // State untuk filter
  const [searchNominal, setSearchNominal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State untuk sorting
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State untuk notifikasi live update
  const [liveNotification, setLiveNotification] = useState("");

  // State untuk edit mode
  const [editingId, setEditingId] = useState(null);
  const [editingNominal, setEditingNominal] = useState("");

  // Fungsi ambil data dari backend
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://jokidins-production.up.railway.app/api/pendapatan/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }
      return data;
    } catch (err) {
      console.error("Error fetching history:", err);
      throw err;
    }
  };

  // Load data dan set ke historyData
  const loadHistory = async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const data = await fetchHistory();
      setHistoryData(data);
    } catch (error) {
      setFetchError("Gagal memuat data pendapatan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Live update dengan polling tiap 30 detik
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const newData = await fetchHistory();
        setHistoryData((prevData) => {
          if (newData.length !== prevData.length) {
            setLiveNotification("Data pendapatan diperbarui!");
            setTimeout(() => setLiveNotification(""), 3000);
            return newData;
          }
          return prevData;
        });
      } catch (err) {
        console.error("Error in live update:", err);
      }
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Fungsi submit form untuk input pendapatan
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedNominal = nominal.replace(/[.,]/g, "");
    if (!/^\d+$/.test(formattedNominal)) {
      setError("Input tidak valid, masukkan angka saja!");
      setSuccess("");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://jokidins-production.up.railway.app/api/pendapatan",
        { nominal: Number(formattedNominal) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSuccess("Data berhasil dikirim!");
        setError("");
        setNominal("");
        loadHistory();
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error submitting income:", err);
      setError("Terjadi kesalahan pada server.");
      setSuccess("");
    }
  };

  // Fungsi untuk update data pendapatan (edit)
  const handleUpdate = async (id) => {
    const formattedNominal = editingNominal.replace(/[.,]/g, "");
    if (!/^\d+$/.test(formattedNominal)) {
      alert("Input tidak valid, masukkan angka saja!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://jokidins-production.up.railway.app/api/pendapatan/${id}`,
        { nominal: Number(formattedNominal) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSuccess("Data berhasil diupdate!");
        setError("");
        setEditingId(null);
        setEditingNominal("");
        loadHistory();
      }
    } catch (err) {
      console.error("Error updating income:", err);
      alert("Terjadi kesalahan saat mengupdate data.");
    }
  };

  // Fungsi untuk menghapus data pendapatan
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus data ini?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://jokidins-production.up.railway.app/api/pendapatan/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setSuccess("Data berhasil dihapus!");
        setError("");
        loadHistory();
      }
    } catch (err) {
      console.error("Error deleting income:", err);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  // Fungsi Export ke PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: "#history-table" });
    doc.save("history.pdf");
  };

  // Fungsi Export ke Excel (menggunakan SheetJS)
  const exportToExcel = () => {
    const formattedData = historyData.map((row) => ({
      Nominal: row.nominal,
      "Tanggal Input": new Date(row.date).toLocaleString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "History");
    XLSX.writeFile(workbook, "history.xlsx");
  };

  // Fungsi untuk filter data berdasarkan nominal dan tanggal
  const filteredHistory = historyData.filter((row) => {
    const nominalMatch = searchNominal
      ? row.nominal.toString().includes(searchNominal)
      : true;
    const rowDate = new Date(row.date);
    const startMatch = startDate ? rowDate >= new Date(startDate) : true;
    const endMatch = endDate ? rowDate <= new Date(endDate) : true;
    return nominalMatch && startMatch && endMatch;
  });

  // Sorting data dengan useMemo
  const sortedHistory = useMemo(() => {
    const sortableItems = [...filteredHistory];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === "date") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredHistory, sortConfig]);

  // Pagination logic dengan data yang sudah di-sort
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedHistory.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Fungsi untuk mengubah konfigurasi sorting saat header diklik
  const requestSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Hitung total pendapatan dari data yang sudah difilter
  const totalPendapatan = filteredHistory.reduce(
    (acc, item) => acc + item.nominal,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
            Dashboard Pendapatan
          </h1>
          <p className="text-center text-slate-400 mt-2">
            Kelola dan analisis pendapatan Anda dengan mudah
          </p>
        </header>

        <main className="p-0 md:p-2">
          {/* Notifikasi Live Update */}
          {liveNotification && (
            <div className="max-w-4xl mx-auto mb-6 p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-center rounded-lg shadow-lg transform transition-all duration-300 animate-pulse">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {liveNotification}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="max-w-4xl mx-auto my-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-xl text-slate-300">Memuat data pendapatan...</p>
            </div>
          ) : fetchError ? (
            <div className="max-w-4xl mx-auto my-12 text-center">
              <div className="bg-red-900/40 p-6 rounded-lg">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-xl text-red-400">{fetchError}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Chart/Graph Line */}
                <div className="bg-slate-800/70 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Tren Pendapatan</h2>
                  <IncomeChart data={filteredHistory} />
                </div>

                {/* Form Input Pendapatan */}
                <div className="bg-slate-800/70 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Tambah Pendapatan Baru</h2>
                  <IncomeForm
                    nominal={nominal}
                    setNominal={setNominal}
                    handleSubmit={handleSubmit}
                    error={error}
                    success={success}
                  />
                </div>

                {/* Total Pendapatan */}
                <div className="bg-slate-800/70 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
                  <IncomeTotal total={totalPendapatan} />
                </div>
              </div>

              <div className="space-y-6">
                {/* Bar Chart untuk pendapatan per bulan */}
                <div className="bg-slate-800/70 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Pendapatan per Bulan</h2>
                  <IncomeBarChart data={filteredHistory} />
                </div>

                {/* Filter Section */}
                <div className="bg-slate-800/70 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-blue-400">Filter & Export</h2>
                      <p className="text-sm text-slate-400 mb-3">Cari, filter, dan ekspor data pendapatan</p>
                    </div>
                    <div className="flex space-x-2">
                      <IncomeExport
                        exportToPDF={exportToPDF}
                        exportToExcel={exportToExcel}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <IncomeFilter
                      searchNominal={searchNominal}
                      setSearchNominal={setSearchNominal}
                      startDate={startDate}
                      setStartDate={setStartDate}
                      endDate={endDate}
                      setEndDate={setEndDate}
                    />
                  </div>
                </div>
              </div>

              {/* Tabel History Pendapatan - Full Width */}
              <div className="lg:col-span-2 bg-slate-800/70 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Riwayat Pendapatan</h2>
                <IncomeTable
                  currentItems={currentItems}
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                  handlePrevPage={handlePrevPage}
                  handleNextPage={handleNextPage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  editingId={editingId}
                  editingNominal={editingNominal}
                  setEditingNominal={setEditingNominal}
                  setEditingId={setEditingId}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                />
                
                {sortedHistory.length === 0 && (
                  <div className="bg-slate-700/30 rounded-lg p-8 text-center">
                    <p className="text-slate-400">Tidak ada data yang sesuai dengan filter</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default IncomePage;