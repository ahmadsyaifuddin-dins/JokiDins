import React, { useState } from 'react';
import { Phone, MessageCircle, CreditCard, Copy, Check, Clock } from 'lucide-react';

const Contact = () => {
  const [showCopied, setShowCopied] = useState(false);
  const [copyType, setCopyType] = useState('');
  
  // Menyembunyikan sebagian nomor rekening
  const bankAccount = {
    bank: 'SeaBank',
    name: 'AHMAD SYAIFUDDIN',
    number: 'Silahkan Chat Admin di WA untuk No. Rek',
    maskedNumber: '901x-xxxx-xxxx'
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-5xl">
        {/* Notification */}
        {showCopied && (
          <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>{copyType} berhasil disalin!</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold text-blue-950 mb-4">
            Hubungi JokiDins
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tim profesional kami siap membantu Anda menyelesaikan berbagai tugas dengan cepat dan handal
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* WhatsApp & Telegram Card */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-blue-500">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <MessageCircle className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800">WhatsApp & Telegram</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <a 
                      href="https://wa.me/6285849910396?text=Kak%20Mau%20Joki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-green-600 hover:text-green-700 font-semibold"
                    >
                      <Phone className="w-6 h-6" />
                      <span>+62 858-4991-0396</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard('085849910396', 'Nomor telepon')}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-green-100 transition-colors"
                    >
                      {showCopied && copyType === 'Nomor telepon' ? (
                        <Check className="w-6 h-6 text-green-500" />
                      ) : (
                        <Copy className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 space-y-2">
                  <p>• Nomor yang sama untuk WhatsApp & Telegram</p>
                  <p>• Nomor dapat langsung diklik untuk memulai chat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information Card */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-indigo-500">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <CreditCard className="w-8 h-8 text-indigo-500" />
                <h2 className="text-2xl font-bold text-gray-800">Informasi Pembayaran</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{bankAccount.bank}</h3>
                      <p className="text-gray-600">{bankAccount.name}</p>
                      <p className="font-mono text-gray-700 mt-1">Nomor Rekening: {bankAccount.maskedNumber}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankAccount.number, 'Nomor rekening')}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      {showCopied && copyType === 'Nomor rekening' ? (
                        <Check className="w-6 h-6 text-green-500" />
                      ) : (
                        <Copy className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 space-y-2">
                  <p>• Nomor rekening sebagian disembunyikan untuk keamanan</p>
                  <p>• Silakan Chat Admin kami untuk mendapatkan No. Rek</p>
                  <p>• Konfirmasi pembayaran via chat admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Hours Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Clock className="w-8 h-8 text-orange-500" />
            <h3 className="text-2xl font-bold text-gray-800">Jam Operasional</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-xl text-gray-700">
              <span className="font-semibold text-orange-600">08.00 - 22.00 WITA</span>
            </p>
            <p className="text-sm text-gray-500 italic">
              * Respon chat mungkin sedikit terlambat di luar jam operasional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;