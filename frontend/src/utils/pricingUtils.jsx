/**
 * Mengonversi harga dari plan menjadi angka.
 * Misalnya, untuk plan.priceStart="Rp50" dan plan.priceStartSmall=".000",
 * fungsi ini akan menghasilkan angka 50000.
 * Asumsi: harga disusun dengan format "Rp" di depan, lalu angka, kemudian "kecil" (misal, ".000").
 *
 * @param {string} mainPart - Bagian utama harga, misalnya "Rp50" atau "120".
 * @param {string} smallPart - Bagian kecil harga, misalnya ".000" atau " Juta" (disesuaikan).
 * @returns {number} Harga dalam bentuk angka.
 */
const parsePrice = (mainPart, smallPart) => {
    // Hapus prefix "Rp" kalau ada, dan spasi
    let numberStr = mainPart.replace("Rp", "").trim();
    // Jika smallPart mengandung angka (misal ".000"), gabungkan
    if (smallPart && smallPart.includes(".")) {
      // Hapus titik dan ambil angka setelah titik
      numberStr += smallPart.replace(/\./g, "");
    } else if (smallPart && smallPart.toLowerCase().includes("juta")) {
      // Contoh: priceEnd: "3,5" dan priceEndSmall: " Juta"
      // Kita bisa ganti koma dengan titik, kemudian kalikan 1 juta
      numberStr = numberStr.replace(",", ".");
      return parseFloat(numberStr) * 1000000;
    }
    return parseInt(numberStr, 10);
  };

/**
 * Render rentang harga paket dengan styling terpisah untuk bagian utama dan kecil.
 * Contoh output: <span className="text-3xl font-bold">Rp50</span>
 *                <span className="text-xl">.000</span> - 
 *                <span className="text-3xl font-bold">Rp120</span>
 *                <span className="text-xl">.000</span>
 *
 * @param {Object} plan - Objek paket harga.
 * @returns {JSX.Element} Elemen JSX yang menampilkan harga dengan style terpisah.
 */
export const renderPriceRange = (plan) => {
  return (
    <>
      <span className="text-3xl font-bold">{plan.priceStart}</span>
      <span className="text-xl">{plan.priceStartSmall}</span>
      <span className="mx-1">-</span>
      <span className="text-3xl font-bold">{plan.priceEnd}</span>
      <span className="text-xl">{plan.priceEndSmall}</span>
    </>
  );
};

  
  /**
   * Menghasilkan rentang harga dari plan.
   * @param {Object} plan - Objek plan dari PricingPage.
   * @returns {Object} { min: number, max: number }
   */
  export const getPriceRange = (plan) => {
    const min = parsePrice(plan.priceStart, plan.priceStartSmall);
    const max = parsePrice(plan.priceEnd, plan.priceEndSmall);
    return { min, max };
  };
  
  /**
   * Menghasilkan string display untuk rentang harga.
   * Contoh: "Rp50.000 - Rp120.000"
   * @param {Object} plan - Objek plan.
   * @returns {string}
   */
  export const formatPriceRange = (plan) => {
    const { min, max } = getPriceRange(plan);
    // Format menggunakan Intl.NumberFormat untuk Indonesia.
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };
  
  /**
   * Mengecek apakah harga input berada di dalam rentang harga plan.
   * @param {Object} plan - Objek plan.
   * @param {number} inputPrice - Harga yang diinput user.
   * @returns {boolean}
   */
  export const isPriceWithinRange = (plan, inputPrice) => {
    const { min, max } = getPriceRange(plan);
    return inputPrice >= min && inputPrice <= max;
  };
  