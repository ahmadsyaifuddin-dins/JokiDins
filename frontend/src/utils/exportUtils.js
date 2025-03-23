import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Format angka dengan pemisah ribuan berupa koma.
 * @param {number} number - Angka yang akan diformat.
 * @returns {string} Angka yang sudah diformat dengan koma.
 */
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Export data ke file PDF dengan summary di footer.
 * Jika data yang di-export merupakan hasil filter (filteredData berbeda dengan allData),
 * akan ditambahkan catatan di footer.
 *
 * @param {Array} allData - Semua data (tanpa paginasi).
 * @param {Array} filteredData - Data yang sudah difilter (opsional).
 * @param {string} fileName - Nama file PDF yang dihasilkan.
 */
export const exportToPDF = (allData, filteredData = null, fileName = "history.pdf") => {
  // Gunakan data yang difilter jika ada, jika tidak gunakan semua data.
  const exportData = Array.isArray(filteredData) ? filteredData : (Array.isArray(allData) ? allData : []);
  
  const doc = new jsPDF();

  // Persiapkan header dan body data untuk tabel PDF.
  const head = [["Nominal", "Tanggal Input"]];
  const body = exportData.map((row) => [
    formatNumber(row.nominal),
    new Date(row.date).toLocaleString(),
  ]);

  // Hitung total pendapatan dan jumlah data.
  const totalPendapatan = exportData.reduce((acc, row) => acc + row.nominal, 0);
  const totalCount = exportData.length;

  // Buat baris summary di footer.
  // Jika data yang difilter berbeda dari semua data, tambahkan catatan filter.
  const foot = [
    [
      `Total Pendapatan: ${formatNumber(totalPendapatan)}`,
      `Total Data: ${totalCount}` 
    ]
  ];
  
  if (filteredData && allData && filteredData.length !== allData.length) {
    foot.push([ "*Data yang ditampilkan merupakan hasil filter", "" ]);
  }

  autoTable(doc, {
    head: head,
    body: body,
    foot: foot,
    footStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [56, 189, 248] },
    margin: { top: 20 },
  });

  doc.save(fileName);
};

/**
 * Export data ke file Excel dengan summary di baris terakhir.
 * Jika data yang di-export merupakan hasil filter (filteredData berbeda dengan allData),
 * akan ditambahkan catatan di baris terakhir.
 *
 * @param {Array} allData - Semua data (tanpa paginasi).
 * @param {Array} filteredData - Data yang sudah difilter (opsional).
 * @param {string} fileName - Nama file Excel yang dihasilkan.
 */
export const exportToExcel = (allData, filteredData = null, fileName = "history.xlsx") => {
  // Gunakan data yang difilter jika ada, jika tidak gunakan semua data.
  const exportData = Array.isArray(filteredData) ? filteredData : (Array.isArray(allData) ? allData : []);
  
  const formattedData = exportData.map((row) => ({
    Nominal: formatNumber(row.nominal),
    "Tanggal Input": new Date(row.date).toLocaleString(),
  }));

  // Hitung total pendapatan dan total data.
  const totalPendapatan = exportData.reduce((acc, row) => acc + row.nominal, 0);
  const totalCount = exportData.length;

  // Tambahkan baris summary di akhir data.
  formattedData.push({
    Nominal: `Total Pendapatan: ${formatNumber(totalPendapatan)}`,
    "Tanggal Input": `Total Data: ${totalCount}`,
  });

  // Jika data yang difilter berbeda dari semua data, tambahkan catatan filter.
  if (filteredData && allData && filteredData.length !== allData.length) {
    formattedData.push({
      Nominal: "*Data yang ditampilkan merupakan hasil filter",
      "Tanggal Input": "",
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(formattedData, { skipHeader: false });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "History");
  XLSX.writeFile(workbook, fileName);
};
