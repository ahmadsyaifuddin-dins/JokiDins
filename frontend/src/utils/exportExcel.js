import * as XLSX from "xlsx";

/**
 * Export data ke file Excel dengan summary di baris terakhir.
 * @param {Array} data - Data pendapatan (seluruh data, tidak hanya halaman yang dipaginasi)
 * @param {string} fileName - Nama file Excel yang dihasilkan.
 */
export const exportToExcel = (data, fileName = "history.xlsx") => {
    const exportData = Array.isArray(data) ? data : [];
    const formattedData = exportData.map((row) => ({
      Nominal: row.nominal,
      "Tanggal Input": new Date(row.date).toLocaleString(),
    }));
  
    // Hitung total pendapatan dan total data
    const totalPendapatan = exportData.reduce((acc, row) => acc + row.nominal, 0);
    const totalCount = exportData.length;
  
    // Tambahkan baris summary di akhir data
    formattedData.push({
      Nominal: `Total Pendapatan: ${totalPendapatan}`,
      "Tanggal Input": `Total Data: ${totalCount}`,
    });
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { skipHeader: false });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "History");
    XLSX.writeFile(workbook, fileName);
  };
