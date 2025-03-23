// HeroTitle.jsx
import React from "react";
import { motion } from "framer-motion";

const HeroTitle = () => {
  return (
    <div className="relative">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-700 to-indigo-800 tracking-tight mb-6">
        JokiDins
      </h1>

      <motion.h1
        className="absolute top-0 left-0 text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent tracking-tight mb-6 pointer-events-none"
        style={{
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          backgroundSize: "300% 100%",
          backgroundImage: `linear-gradient(
            110deg,
            transparent 0%,
            transparent 25%,
            rgba(255,255,255,0.15) 35%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0.15) 65%,
            transparent 75%,
            transparent 100%
          )`,
        }}
        initial={{ backgroundPosition: "-150% 0" }}
        animate={{ backgroundPosition: ["-150% 0", "150% 0"] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
      >
        JokiDins
      </motion.h1>

      <motion.h1
        className="absolute top-0 left-0 text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent tracking-tight mb-6 pointer-events-none"
        style={{
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          backgroundSize: "400% 100%",
          backgroundImage: `linear-gradient(
            95deg,
            transparent 0%,
            transparent 15%,
            rgba(255,255,255,0.1) 25%,
            rgba(255,255,255,0.4) 40%,
            rgba(255,255,255,0.1) 55%,
            transparent 65%,
            transparent 100%
          )`,
        }}
        initial={{ backgroundPosition: "-200% 0" }}
        animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
        transition={{ repeat: Infinity, duration: 3.4, ease: "linear" }}
      >
        JokiDins
      </motion.h1>

      <motion.h1
        className="absolute top-0 left-0 text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent tracking-tight mb-6 pointer-events-none"
        style={{
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          backgroundSize: "200% 200%",
          backgroundImage: `linear-gradient(
            45deg,
            rgba(255,255,255,0.02) 0%,
            rgba(255,255,255,0.05) 50%,
            rgba(255,255,255,0.02) 100%
          )`,
        }}
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      >
        JokiDins
      </motion.h1>
    </div>
  );
};

export default HeroTitle;
