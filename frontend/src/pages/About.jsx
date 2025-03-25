import React from 'react';
import { Award, Users, Shield, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-blue-950 mb-4">
          Tentang JokiDins
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Platform jasa layanan joki tugas terpercaya dengan tim ahli yang siap membantu 
          menyelesaikan tugas akademik Anda dengan kualitas terbaik.
        </p>
      </div>

      {/* Vision Mission Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-blue-950">Visi Kami</h2>
              <p className="text-gray-600">
                Menjadi platform terdepan dalam memberikan solusi akademik berkualitas 
                yang membantu mahasiswa mencapai kesuksesan dalam pendidikan mereka.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-blue-950">Misi Kami</h2>
              <ul className="text-gray-600 space-y-2">
                <li>• Menyediakan layanan berkualitas tinggi dengan harga terjangkau</li>
                <li>• Memastikan kerahasiaan dan keamanan data klien</li>
                <li>• Memberikan solusi tepat waktu dan sesuai kebutuhan</li>
                <li>• Terus meningkatkan kualitas layanan melalui inovasi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-blue-950" />
            </div>
            <h3 className="text-xl font-semibold text-blue-950 mb-2">Kualitas Terjamin</h3>
            <p className="text-gray-600">
              Tim ahli kami terdiri dari profesional berpengalaman di bidangnya
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-950" />
            </div>
            <h3 className="text-xl font-semibold text-blue-950 mb-2">100% Aman</h3>
            <p className="text-gray-600">
              Kerahasiaan data dan transaksi Anda adalah prioritas utama kami
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-950" />
            </div>
            <h3 className="text-xl font-semibold text-blue-950 mb-2">Tepat Waktu</h3>
            <p className="text-gray-600">
              Kami berkomitmen menyelesaikan tugas sesuai deadline yang disepakati
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-950" />
            </div>
            <h3 className="text-xl font-semibold text-blue-950 mb-2">Support 24/7</h3>
            <p className="text-gray-600">
              Tim support kami siap membantu Anda kapanpun dibutuhkan
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-950 mb-4">Tim Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dipimpin oleh para profesional berpengalaman yang berkomitmen untuk memberikan 
            layanan terbaik bagi setiap klien.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
    <div className="w-24 h-24 bg-blue-950 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
      AS
    </div>
    <h3 className="text-xl font-semibold text-blue-950 mb-1">Ahmad Syaifuddin</h3>
    <p className="text-gray-500 mb-4">Founder & CEO</p>
    <p className="text-gray-600">
      Ahli teknologi informasi dengan pengalaman lebih dari 1 tahun dalam pengembangan strategi bisnis digital dan manajemen proyek teknologi
    </p>
  </div>
  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
    <div className="w-24 h-24 bg-blue-950 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
      TD
    </div>
    <h3 className="text-xl font-semibold text-blue-950 mb-1">Tiara Desmitha Oliviany</h3>
    <p className="text-gray-500 mb-4">Administrator</p>
    <p className="text-gray-600">
      Ahli administrasi berpengalaman dengan keahlian dalam manajemen operasional dan pengembangan sistem informasi
    </p>
  </div>
  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
    <div className="w-24 h-24 bg-blue-950 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
     F
    </div>
    <h3 className="text-xl font-semibold text-blue-950 mb-1">Fitriani</h3>
    <p className="text-gray-500 mb-4">Marketing Manager</p>
    <p className="text-gray-600">
      Praktisi marketing berbakat dengan strategi inovatif dalam pengembangan brand dan akuisisi pelanggan
    </p>
  </div>
  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
    <div className="w-24 h-24 bg-blue-950 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
     MR
    </div>
    <h3 className="text-xl font-semibold text-blue-950 mb-1">Maulida Rahmah</h3>
    <p className="text-gray-500 mb-4">Konsultan Bisnis & HRD</p>
    <p className="text-gray-600">
      Pakar sumber daya manusia dan konsultasi bisnis dengan fokus pada pengembangan strategi organisasi dan manajemen talenta
    </p>
  </div>
</div>
      </div>
    </div>
  );
};

export default About;