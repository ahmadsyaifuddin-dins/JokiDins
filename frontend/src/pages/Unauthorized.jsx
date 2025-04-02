import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Unauthorized = () => {

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-100 text-red-700 p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Akses Ditolak!</h1>
      <p className="text-lg mb-6 text-center">
        Maaf bro, kamu nggak diizinkan untuk mengakses halaman ini.
      </p>
      <Link
        to="/"
        className="bg-red-700 hover:bg-red-800 transition duration-200 text-white py-2 px-4 rounded"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default Unauthorized;
