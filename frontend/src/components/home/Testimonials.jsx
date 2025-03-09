import { Star } from "lucide-react";
import React from "react";

const Testimonials = () => {
    
    const testimonials = [
        {
          name: "Andi Permana",
          role: "Mahasiswa Informatika",
          content:
            "Sangat puas dengan hasil website yang dibuat JokiDins. Pengerjaan cepat dan hasilnya profesional!",
          rating: 5,
          avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuUfHOObCMLKoXllPHh-neVeHGtYnkkiZWfg&s",
        },
        {
          name: "Sarah Wijaya",
          role: "Pemilik Bisnis Online",
          content:
            "Sudah 3 kali order desain di JokiDins dan selalu puas dengan hasilnya. Revisi juga cepat diresponnya.",
          rating: 5,
          avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuUfHOObCMLKoXllPHh-neVeHGtYnkkiZWfg&s",
        },
        {
          name: "Budi Santoso",
          role: "Mahasiswa Teknik",
          content:
            "Tugas akhir saya jadi tepat waktu berkat bantuan tim JokiDins. Rekomendasikan!",
          rating: 4,
          avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuUfHOObCMLKoXllPHh-neVeHGtYnkkiZWfg&s",
        },
      ];

    return (
    <section className="py-24 px-4 relative bg-gray-900/30">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-yellow-400 text-sm font-medium mb-4 inline-block shadow-lg shadow-yellow-900/10">
            Testimoni
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
            Apa Kata Mereka?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pendapat klien kami tentang layanan JokiDins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-yellow-500/30 shadow-xl transition-all duration-300 hover:shadow-yellow-900/10 transform hover:-translate-y-2"
            >
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-yellow-500/30"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-yellow-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-gray-300 italic">
                  " {testimonial.content} "
                </p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
