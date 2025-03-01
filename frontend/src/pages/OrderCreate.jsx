import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Fungsi untuk deteksi provider, termasuk Smartfren dan Axis
function detectProvider(phone) {
  const digits = phone.replace(/\D/g, ""); // hapus karakter non-digit

  // Daftar prefix masing-masing provider (contoh, sesuaikan dengan data aktual)
  const telkomselPrefixes = ["0811","0812","0813","0821","0822","0823","0851","0852","0853","0828"];
  const indosatPrefixes  = ["0814","0815","0816","0855","0856","0857","0858"];
  const xlPrefixes       = ["0817","0818","0819","0859","0877","0878","0879"];
  const triPrefixes      = ["0895","0896","0897","0898","0899"];
  const smartfrenPrefixes= ["0881","0882","0883","0884","0885","0886","0887","0888","0889"];
  const axisPrefixes     = ["0831","0832","0833","0838"];

  // Cek dengan mengambil 4 atau 3 digit awal
  const prefix4 = digits.substring(0,4);
  const prefix3 = digits.substring(0,3);

  if (telkomselPrefixes.includes(prefix4) || telkomselPrefixes.includes(prefix3)) {
    return "Telkomsel";
  } else if (indosatPrefixes.includes(prefix4) || indosatPrefixes.includes(prefix3)) {
    return "Indosat";
  } else if (xlPrefixes.includes(prefix4) || xlPrefixes.includes(prefix3)) {
    return "XL";
  } else if (triPrefixes.includes(prefix4) || triPrefixes.includes(prefix3)) {
    return "Tri";
  } else if (smartfrenPrefixes.includes(prefix4) || smartfrenPrefixes.includes(prefix3)) {
    return "Smartfren";
  } else if (axisPrefixes.includes(prefix4) || axisPrefixes.includes(prefix3)) {
    return "Axis";
  }
  return "Unknown";
}

// Fungsi validasi dasar nomor HP: harus mulai dengan 0 dan memiliki panjang 9-14 digit
function validatePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (!digits.startsWith("0")) return false; // Pastikan dimulai dengan 0
  if (digits.length < 9 || digits.length > 14) return false;
  return true;
}

const OrderCreate = () => {
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // State untuk nomor HP
  const [savedPhones, setSavedPhones] = useState([]); // daftar nomor yang sudah tersimpan
  const [selectedPhoneOption, setSelectedPhoneOption] = useState('new'); // 'new' atau nilai nomor dari savedPhones
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('Unknown');

  const navigate = useNavigate();

  // Fetch saved phone numbers dari backend (endpoint: GET /api/user/phones)
  useEffect(() => {
    const fetchPhones = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('https://jokidins-production.up.railway.app/api/user/phones', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Misalnya respon berupa array string: ["08123456789", "08234567890"]
        setSavedPhones(res.data);
      } catch (error) {
        console.error("Gagal ambil nomor HP tersimpan:", error);
      }
    };
    fetchPhones();
  }, []);

  // Jika user memilih nomor yang sudah tersimpan, set phone dan provider
  useEffect(() => {
    if (selectedPhoneOption !== 'new') {
      setPhone(selectedPhoneOption);
      setProvider(detectProvider(selectedPhoneOption));
    } else {
      setPhone('');
      setProvider('Unknown');
    }
  }, [selectedPhoneOption]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || '');
  };

  const handlePhoneInputChange = (e) => {
    let input = e.target.value;
    // Jika input tidak dimulai dengan "0", secara otomatis tambahkan "0" di awal
    if (input && !input.startsWith("0")) {
      input = "0" + input;
    }
    setPhone(input);
    setProvider(detectProvider(input));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Validasi nomor HP jika input dari "Input Nomor Baru"
    if (selectedPhoneOption === 'new') {
      if (!validatePhone(phone)) {
        alert("Nomor HP tidak valid. Pastikan format dan panjangnya benar.");
        return;
      }
    } else {
      // Jika menggunakan nomor tersimpan, validasi tetap bisa diterapkan (opsional)
      if (!validatePhone(selectedPhoneOption)) {
        alert("Nomor HP tersimpan tidak valid.");
        return;
      }
    }

    const formData = new FormData();
    formData.append('service', service);
    formData.append('description', description);
    formData.append('deadline', deadline);
    // Gunakan nomor yang dipilih atau input baru
    formData.append('phone', selectedPhoneOption === 'new' ? phone : selectedPhoneOption);
    formData.append('provider', provider);

    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post('https://jokidins-production.up.railway.app/api/orders', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Order berhasil dibuat!');
      navigate('/OrderList');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Gagal membuat order.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
      <button
          onClick={() => navigate('/OrderList')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali ke Daftar Pesanan</span>
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Buat Order Baru</h1>
          <p className="text-gray-600">Silakan isi detail order anda di bawah ini</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service */}
          <div>
            <label 
              htmlFor="service" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Joki Apa
            </label>
            <input
              id="service"
              type="text"
              placeholder="Bikin PPT, Bikin Aplikasi Web, dll"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi Joki
            </label>
            <textarea
              id="description"
              placeholder="Jelaskan detail kebutuhan anda"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         outline-none transition-colors resize-none"
            />
          </div>

          {/* Deadline */}
          <div>
            <label 
              htmlFor="deadline" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deadline (Tanggal & Waktu)
            </label>
            <input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         outline-none transition-colors"
            />
          </div>

          {/* Phone Number Section */}
          <div>
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nomor HP / WA Aktif
            </label>
            {/* Dropdown untuk memilih nomor yang tersimpan */}
            {savedPhones.length > 0 && (
              <select
                value={selectedPhoneOption}
                onChange={(e) => setSelectedPhoneOption(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="new">-- Input Nomor Baru --</option>
                {savedPhones.map((num, idx) => (
                  <option key={idx} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            )}
            {/* Jika memilih "Input Nomor Baru", tampilkan input field */}
            {selectedPhoneOption === 'new' && (
              <>
                <input
                  id="phone"
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={phone}
                  onChange={handlePhoneInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-colors"
                />
                {phone && (
                  <p className="text-sm text-gray-600 mt-1">
                    Provider: <span className="font-medium">{provider}</span>
                  </p>
                )}
              </>
            )}
          </div>

          {/* File Upload */}
          {/* <div>
            <label 
              htmlFor="file" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload File (disarankan kirim ke WA admin aja :D)
            </label>
            <div className="mt-1 flex items-center">
              <button
                type="button"
                onClick={() => document.getElementById('file-upload').click()}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg 
                           text-sm font-medium text-gray-700 hover:bg-gray-50 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Pilih File
              </button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileName && (
                <span className="ml-3 text-sm text-gray-500">
                  {fileName}
                </span>
              )}
            </div>
          </div> */}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg 
                         hover:bg-blue-800 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-offset-2 
                         transition-colors font-medium"
            >
              Buat Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCreate;
