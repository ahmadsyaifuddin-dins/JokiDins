import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-center">
          &copy; {new Date().getFullYear()} JokiDins dibuat oleh <b>Ahmad Syaifuddin</b> dengan React & Vite. All rights reserved.
        </p>
        <div className="mt-4 sm:mt-0">
          <Link to="/terms" className="text-sm mx-2 hover:text-gray-300 transition-colors duration-200">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-sm mx-2 hover:text-gray-300 transition-colors duration-200">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
