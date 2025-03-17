import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRight, Check, CheckCircle, Send } from "lucide-react";

const TelegramLinkButton = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [glowEffect, setGlowEffect] = useState(false);

  // Toggle glow effect every 2 seconds for shiny animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowEffect((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateToken = async () => {
    const userToken = localStorage.getItem("token");
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://jokidins-production.up.railway.app/api/telegram/regenerate-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setToken(response.data.token);
    } catch (err) {
      setError("Gagal generate token, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col items-center">
      <button
        onClick={handleGenerateToken}
        disabled={loading}
        className={`
          relative overflow-hidden
          bg-gradient-to-r from-blue-600 to-blue-500
          hover:from-blue-500 hover:to-blue-400
          text-white font-bold py-4 px-8 rounded-full
          transform hover:scale-105 transition-all duration-300
          shadow-lg ${glowEffect ? "shadow-blue-500/50" : "shadow-blue-600/30"}
          ${loading ? "opacity-80" : "opacity-100"}
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
        `}
      >
        {/* Shiny effect overlay */}
        <span className="absolute top-0 left-0 w-full h-full">
          <span
            className={`
            absolute top-0 -left-1/2 w-1/3 h-full 
            bg-gradient-to-r from-transparent via-white to-transparent 
            transform -skew-x-12 opacity-30
            transition-all duration-1000 ease-in-out
            ${glowEffect ? "translate-x-[420%]" : "translate-x-[-100%]"}
          `}
          ></span>
        </span>

        {/* Button text */}
        <span className="relative z-10 flex items-center justify-center">
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
             <CheckCircle className="w-5 h-5 mr-3" />
              Link Telegram
            </>
          )}
        </span>
      </button>

      {token && (
        <div className="mt-6 p-4 md:p-5 bg-white border border-blue-100 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 hover:shadow-blue-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center dark:bg-blue-900">
                <svg
                  className="w-5 h-5 text-blue-500 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <p className="text-sm text-gray-700 font-medium dark:text-gray-300">
                Token berhasil dibuat!
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg overflow-hidden border border-blue-100 dark:bg-gray-700 dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Token Anda:
                </span>             
              </div>
              <p className="font-mono text-sm font-bold text-blue-600 break-all dark:text-blue-400">
                {token}
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center dark:text-gray-400">
              Klik tombol di bawah untuk menghubungkan dengan Telegram Bot
            </p>

            <a
              href={`https://t.me/JokiDins_Bot?start=${token}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`
          px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500
          hover:from-blue-500 hover:to-blue-400
          text-white text-center font-medium rounded-lg
          flex items-center justify-center space-x-1
          transform hover:translate-y-[-2px] hover:shadow-md
          transition-all duration-300
          ${glowEffect ? "shadow-blue-300/50" : ""}
          relative overflow-hidden
        `}
            >
              {/* Shiny effect overlay */}
              <span className="absolute top-0 left-0 w-full h-full">
                <span
                  className={`
              absolute top-0 -left-1/2 w-1/3 h-full 
              bg-gradient-to-r from-transparent via-white to-transparent 
              transform -skew-x-12 opacity-30
              transition-all duration-1000 ease-in-out
              ${glowEffect ? "translate-x-full" : "translate-x-0"}
            `}
                ></span>
              </span>
              <span className="relative z-10">Buka Telegram Bot</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 flex items-center w-full max-w-md">
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TelegramLinkButton;
