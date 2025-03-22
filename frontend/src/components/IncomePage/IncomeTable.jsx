import React from "react";

const IncomeTable = ({
  currentItems,
  sortConfig,
  requestSort,
  handlePrevPage,
  handleNextPage,
  currentPage,
  itemsPerPage,
  totalPages,
  editingId,
  editingNominal,
  setEditingNominal,
  setEditingId,
  handleUpdate,
  handleDelete,
}) => {
  // Format angka ke format rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table id="history-table" className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-700 text-slate-300">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer group relative"
                onClick={() => requestSort("nominal")}
              >
                <div className="flex items-center justify-between">
                  <span>Nominal</span>
                  <div className="ml-1">
                    {sortConfig.key === "nominal" ? (
                      sortConfig.direction === "asc" ? (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      )
                    ) : (
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer group relative"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center justify-between">
                  <span>Tanggal</span>
                  <div className="ml-1">
                    {sortConfig.key === "date" ? (
                      sortConfig.direction === "asc" ? (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      )
                    ) : (
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item._id} className="border-b border-slate-700 bg-slate-800/50 hover:bg-slate-700/40 transition-colors">
                <td className="px-4 py-3">
                  {editingId === item._id ? (
                    <input
                      type="text"
                      value={editingNominal}
                      onChange={(e) => setEditingNominal(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="font-medium text-emerald-400">{formatRupiah(item.nominal)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {new Date(item.date).toLocaleString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  {editingId === item._id ? (
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-xs font-medium flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors text-xs font-medium flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(item._id);
                          setEditingNominal(item.nominal.toString());
                        }}
                        className="p-1.5 bg-blue-600/70 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 bg-red-600/70 text-white rounded hover:bg-red-700 transition-colors"
                        title="Hapus"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-slate-400">
            Menampilkan {currentItems.length} dari {totalPages * itemsPerPage} entri
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded ${
                currentPage === 1
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } transition-colors flex items-center text-sm`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Prev
            </button>
            <div className="px-3 py-1.5 bg-slate-700 rounded text-center text-sm min-w-[80px]">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded ${
                currentPage === totalPages
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } transition-colors flex items-center text-sm`}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeTable;