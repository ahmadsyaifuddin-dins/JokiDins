import React, { useState } from 'react';
import { Phone, MessageCircle, CreditCard, Copy, Check } from 'lucide-react';

const Contact = () => {
  const [showCopied, setShowCopied] = useState(false);
  const [copyType, setCopyType] = useState('');

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setCopyType(type);
    setTimeout(() => {
      setShowCopied(false);
      setCopyType('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {showCopied && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-down">
            {copyType} berhasil disalin!
          </div>
        )}

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">Hubungi Kami</h1>
          <p className="text-lg text-gray-600">Siap membantu menyelesaikan tugas-tugas Anda</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card WhatsApp & Telegram */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">WhatsApp & Telegram</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">Chat admin kami melalui</p>
                <div className="flex items-center justify-between">
                  <a 
                    href="https://wa.me/6285849910396?text=Kak%20Mau%20Joki" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  >
                    <Phone className="w-5 h-5" />
                    +62 858-4991-0396
                  </a>
                  <button
                    onClick={() => copyToClipboard('085849910396', 'Nomor telepon')}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {showCopied && copyType === 'Nomor telepon' ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500">*Nomor yang sama untuk WhatsApp & Telegram</p>
                <p className="text-sm text-gray-500">*Nomor diatas bisa langsung diklik</p>
              </div>
            </div>
          </div>

          {/* Card Informasi Pembayaran */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-100">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Informasi Pembayaran</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">SeaBank</h3>
                  <p className="text-gray-600">AHMAD SYAIFUDDIN</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-600 font-mono">Chat Admin</p>
                    <button
                      onClick={() => copyToClipboard('901139597160', 'Nomor rekening')}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {showCopied && copyType === 'Nomor rekening' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center animate-fade-in">
          <p className="text-gray-600">
            Jam Operasional: <span className="font-medium">08.00 - 22.00 WITA</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            *Respon chat mungkin akan sedikit terlambat di luar jam operasional
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;