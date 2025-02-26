import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Syarat dan Ketentuan</h1>
      <p className="mb-4 text-gray-700">
        Selamat datang di JokiDins! Dengan menggunakan layanan kami, termasuk login dengan akun Google,
        Anda menyetujui syarat dan ketentuan berikut. Kami hanya mengambil data sensitif yang diperlukan untuk
        autentikasi dan peningkatan layanan, dan data tersebut tidak akan disalahgunakan.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Penggunaan Layanan</h2>
      <p className="mb-4 text-gray-700">
        Dengan mendaftar dan menggunakan layanan kami, Anda setuju bahwa data pribadi yang dikumpulkan (seperti nama,
        email, dan foto profil dari Google) hanya digunakan untuk autentikasi dan keperluan internal. Kami tidak akan
        membagikan data Anda kepada pihak ketiga tanpa izin, kecuali jika diwajibkan oleh hukum.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Kewajiban Pengguna</h2>
      <p className="mb-4 text-gray-700">
        Anda bertanggung jawab atas keamanan akun dan informasi login Anda. Jika terjadi penyalahgunaan data, 
        kami berhak menghentikan akses Anda ke layanan kami.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Perubahan Syarat dan Ketentuan</h2>
      <p className="mb-4 text-gray-700">
        Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diumumkan melalui situs 
        kami, dan dengan terus menggunakan layanan, Anda menyetujui syarat yang telah diperbarui.
      </p>
      <p className="text-gray-700">
        Jika Anda memiliki pertanyaan atau kekhawatiran, silakan hubungi tim support kami.
      </p>
    </div>
  );
};

export default TermsOfService;
