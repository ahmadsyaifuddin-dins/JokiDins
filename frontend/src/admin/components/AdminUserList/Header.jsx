import React from 'react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Daftar Pengguna
      </h1>
      <p className="text-blue-100">
        Kelola semua pengguna terdaftar dalam sistem
      </p>
    </div>
  );
};

export default Header;