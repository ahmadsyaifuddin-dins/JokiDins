// Hero.jsx
import React from "react";
import { motion } from "framer-motion";
import BackgroundAnimation from "./Hero/BackgroundAnimation";
import HeroTitle from "./Hero/HeroTitle";
import AnimatedText from "./Hero/AnimatedText";
import ActionButtons from "./Hero/ActionButtons";
import CodeSnippet from "./Hero/CodeSnippet";

const Hero = () => {
  const texts = [
    "Tugas & project numpuk? Santai, serahin aja ke kita. Hasil maksimal tanpa ribet 😸",
    "Butuh layanan cepat dan terpercaya? Kami hadir dengan solusi cerdas, harga bersahabat, dan dukungan 24/7 untuk bantu kamu wujudin ide-ide brilianmu!",
    "Masalah deadline mepet? Tenang, serahin ke kita, biar hasil kerja optimal tanpa stres!",
    "Bingung dengan tugas kompleks? Rileks, kami siap bantu kamu dengan solusi profesional yang melebihi ekspektasi! ✨",
    "Kejar deadline dengan tenang. Layanan joki kami jamin kualitas premium dengan harga mahasiswa! 💯",
    "Terjebak dengan tugas rumit? Percayakan ke tim ahli kami, selesai tepat waktu dengan hasil excellence! 🚀",
    "Butuh bantuan dengan projek kilat? Kami hadir 24/7 dengan solusi cepat, akurat dan terpercaya! 🔥",
    "Pusing mikirin tugas? Jangan stress! Serahkan ke kami, kamu fokus hal lain, kami yang kerjain detailnya! 🎯",
    "Kualitas tak perlu mahal! Layanan joki terbaik dengan garansi revisi dan konsultasi pasca pengerjaan! 👨‍💻",
    "Waktu terbatas tapi tugas numpuk? Andalkan jasa kami untuk hasil maksimal tanpa perlu begadang! 🌙",
    "Project mendadak? Tim expert kami siap bantu dengan pelayanan kilat dan hasil premium yang bikin dosen kagum! 🏆",
    "Jadikan tugasmu masterpiece dengan bantuan tim profesional kami. Cepat, tepat, dan dijamin anti-plagiat! ✅",
    "Kualitas adalah prioritas kami! Percayakan tugas pentingmu pada joki berpengalaman dengan rekam jejak terpercaya! 💪",
  ];

  return (
    <section className="relative min-h-screen flex items-center py-16 md:py-24 overflow-hidden">
      <BackgroundAnimation />
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-full flex flex-col justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center mb-8 space-y-8 md:space-y-12">
          <HeroTitle />
          <AnimatedText texts={texts} />
          <ActionButtons />
        </div>
        <CodeSnippet />
      </motion.div>
    </section>
  );
};

export default Hero;
