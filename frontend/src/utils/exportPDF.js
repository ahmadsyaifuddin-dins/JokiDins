import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export data ke file PDF dengan summary di footer.
 * @param {Array} data - Data pendapatan (seluruh data, tidak hanya halaman yang dipaginasi)
 * @param {string} fileName - Nama file PDF yang dihasilkan.
 */
export const exportToPDF = (data, fileName = "history.pdf") => {
    // Pastikan data berupa array
    const exportData = Array.isArray(data) ? data : [];
    const doc = new jsPDF();
  
    // Persiapkan header dan body data untuk tabel PDF
    const head = [["Nominal", "Tanggal Input"]];
    const body = exportData.map((row) => [
      row.nominal,
      new Date(row.date).toLocaleString(),
    ]);
  
    // Hitung total pendapatan dan jumlah data
    const totalPendapatan = exportData.reduce((acc, row) => acc + row.nominal, 0);
    const totalCount = exportData.length;
  
    // Buat baris summary di footer
    const foot = [[`Total Pendapatan: ${totalPendapatan}`, `Total Data: ${totalCount}`]];
  
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