import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Kebijakan Privasi</h1>
      <p className="mb-4 text-gray-700">
        Kebijakan Privasi ini menjelaskan bagaimana JokiDins mengumpulkan, menggunakan, dan melindungi data 
        pribadi Anda. Kami menghargai privasi Anda dan memastikan bahwa data sensitif yang diambil, terutama 
        melalui login dengan Google, hanya digunakan untuk keperluan autentikasi dan peningkatan layanan.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Data yang Kami Kumpulkan</h2>
      <p className="mb-4 text-gray-700">
        Saat Anda menggunakan layanan kami, kami mengumpulkan data seperti:
      </p>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>Nama dan email</li>
        <li>Foto profil (jika tersedia)</li>
        <li>Informasi lainnya yang diperlukan untuk autentikasi</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Penggunaan Data</h2>
      <p className="mb-4 text-gray-700">
        Data pribadi yang dikumpulkan digunakan untuk:
      </p>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>Autentikasi dan keamanan akun</li>
        <li>Meningkatkan pengalaman pengguna dan layanan kami</li>
        <li>Mengirim informasi terkait akun Anda</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Perlindungan Data</h2>
      <p className="mb-4 text-gray-700">
        Kami tidak akan menjual atau membagikan data pribadi Anda kepada pihak ketiga tanpa izin Anda,
        kecuali jika diwajibkan oleh hukum.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Perubahan Kebijakan Privasi</h2>
      <p className="mb-4 text-gray-700">
        Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu. Setiap perubahan akan diumumkan melalui situs 
        kami. Penggunaan layanan kami setelah perubahan berarti Anda menyetujui kebijakan yang telah diperbarui.
      </p>
      <p className="text-gray-700">
        Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
