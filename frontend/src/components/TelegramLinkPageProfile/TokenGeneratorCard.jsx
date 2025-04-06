// TokenGeneratorCard.jsx
import React, { useState } from "react";
import axios from "axios";
import { ClipboardCopy, ExternalLink, RefreshCw, Check, AlertCircle, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "../../config";

const TokenGeneratorCard = () => {
  const [token, setToken] = useState("");
  const [generatedTime, setGeneratedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const generateToken = async () => {
    try {
      setLoading(true);
      setError(null);
      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/telegram/regenerate-token`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setToken(response.data.token);
      setGeneratedTime(new Date());
    } catch (err) {
      setError("Gagal generate token. Silakan coba lagi.");
      console.error("Error generating token:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-500/20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-3">
              <RefreshCw className="w-6 h-6" />
            </span>
            Generate Token Telegram
          </h3>
          <p className="text-blue-100 mt-1">
            Token hanya aktif selama 24 jam setelah dibuat
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-3" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {!token ? (
              <button
                onClick={generateToken}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center text-lg shadow-md hover:shadow-indigo-600/30"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 mr-2" />
                )}
                Generate Token
              </button>
            ) : (
              <div className="space-y-6">
                {generatedTime && (
                  <div className="text-xs text-gray-400 text-center">
                    Token dibuat pada {generatedTime.toLocaleTimeString()} • Berlaku selama 24 jam
                  </div>
                )}
                <div className="relative">
                  <input
                    type="text"
                    value={token}
                    readOnly
                    className="w-full bg-slate-800/70 border border-slate-700 rounded-lg py-3 px-4 pr-12 font-mono text-gray-100 text-lg shadow-inner"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 p-1.5 bg-slate-900/50 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <ClipboardCopy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={generateToken}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center border border-slate-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Ulang
                  </button>
                  <a
                    href={`https://t.me/JokiDins_Bot?start=${token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-indigo-600/30"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buka di Telegram
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center mx-auto"
            >
              {showInstructions ? "Sembunyikan petunjuk" : "Lihat petunjuk penggunaan"}
              <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showInstructions ? "rotate-90" : ""}`} />
            </button>

            {showInstructions && (
              <div className="mt-4 bg-blue-900/20 border border-blue-800/40 rounded-lg p-5 text-gray-300">
                <h4 className="font-bold mb-3 text-white">
                  Cara Menghubungkan ke Telegram:
                </h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Generate token dengan klik tombol di atas</li>
                  <li>Klik tombol buka telegram</li>
                  <li>Selesai! Akun Anda telah terhubung dengan Telegram</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenGeneratorCard;
