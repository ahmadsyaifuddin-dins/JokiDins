import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderCreate = () => {
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  // Ubah state deadline untuk menyimpan value datetime-local
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('service', service);
    formData.append('description', description);
    formData.append('deadline', deadline);
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post('http://localhost:5000/api/orders', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Order berhasil dibuat!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Gagal membuat order.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Buat Order Baru</h1>
          <p className="text-gray-600">Silakan isi detail order anda di bawah ini</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            />
          </div>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label 
              htmlFor="file" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload File
            </label>
            <div className="mt-1 flex items-center">
              <button
                type="button"
                onClick={() => document.getElementById('file-upload').click()}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
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
