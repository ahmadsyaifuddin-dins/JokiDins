import { ArrowRight, MessageSquare } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background with improved particle system */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(59, 130, 246, 0.1) 2px, transparent 2px)",
            backgroundSize: "50px 50px, 100px 100px",
          }}
        />
      </div>

      {/* Enhanced glowing orbs with consistent blur effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-900 rounded-full filter blur-xl opacity-20 animate-pulse duration-4000"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-950 rounded-full filter blur-xl opacity-20 animate-pulse duration-5000"></div>
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-slate-950 rounded-full filter blur-xl opacity-10 animate-pulse duration-3000"></div>

      {/* Content Container with animations - Fixed by using motion.div instead of opacity-0 */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {/* Base gradient text */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-700 to-indigo-800 tracking-tight mb-6">
              JokiDins
            </h1>

            {/* Main shimmer layer */}
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
              transition={{
                repeat: Infinity,
                duration: 2.8,
                ease: "linear",
              }}
            >
              JokiDins
            </motion.h1>

            {/* Secondary shimmer layer */}
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
              transition={{
                repeat: Infinity,
                duration: 3.4,
                ease: "linear",
              }}
            >
              JokiDins
            </motion.h1>

            {/* Subtle ambient glow */}
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
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "linear",
              }}
            >
              JokiDins
            </motion.h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8 overflow-hidden text-ellipsis">
            Tugas & project numpuk? Santai, serahin aja ke kita. Hasil maksimal tanpa ribet 😸
          </p>
          <div className="flex gap-2 md:gap-4 justify-center">
            <Link to="/create-order" className="w-auto sm:w-auto">
              <motion.button
                className="bg-gradient-to-r from-blue-500 via-pink-600 to-blue-600 text-white px-4 py-4 rounded-lg font-bold flex items-center justify-center gap-2 border border-white/10 relative overflow-hidden shadow-lg"
                initial={{ y: 0 }}
                animate={{
                  y: [0, -3, 0],
                  boxShadow: [
                    "0 5px 15px rgba(59, 130, 246, 0.3)",
                    "0 8px 20px rgba(219, 39, 119, 0.5)",
                    "0 5px 15px rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                {/* Background animations */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-600 to-blue-600 opacity-80"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                />

                {/* Glow effect */}
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-pink-600/30 to-blue-500/30 blur-md rounded-lg"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />

                {/* Shimmer effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "50%",
                    skewX: "-20deg",
                  }}
                />

                <span className="relative z-10 flex items-center justify-center gap-1 md:gap-2">
                  <span className="text-white text-base">Order Joki</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </motion.span>
                </span>
              </motion.button>
            </Link>
            <Link to="/contact" className="w-auto sm:w-auto">
              <motion.button
                className="bg-gray-900 text-white border border-gray-700 px-4 py-4 rounded-lg font-medium flex items-center justify-center gap-2"
                whileHover={{
                  y: -4,
                  borderColor: "rgba(59, 130, 246, 0.5)",
                  boxShadow: "0 10px 15px -3px rgba(30, 64, 175, 0.1)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                Kontak
                <motion.span
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <MessageSquare className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Enhanced code snippet preview with better 3D effect and syntax highlighting - Fixed by using motion.div */}
        <motion.div
          className="mt-5 mb-8 block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative bg-gray-900/80 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-gray-800/80 shadow-2xl transform hover:scale-105 transition-all duration-500 max-w-3xl mx-auto code-snippet">
            <div className="flex items-center gap-2 mb-2 md:mb-4">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-400 text-xs md:text-sm ml-2">
                jokidins.jsx
              </span>
            </div>
            <div className="font-mono text-xs md:text-sm text-gray-300 overflow-x-auto pb-2">
              <div className="text-blue-400 whitespace-pre">
                const <span className="text-green-400">createProject</span> ={" "}
                <span className="text-yellow-400">()</span> =&gt; {"{"}
              </div>
              <div className="pl-4 md:pl-6 whitespace-pre">return {"{"}</div>
              <div className="pl-8 md:pl-12 whitespace-pre">
                <span className="text-purple-400">kualitas</span>:{" "}
                <span className="text-yellow-400">'unggulan'</span>,
              </div>
              <div className="pl-8 md:pl-12 whitespace-pre">
                <span className="text-purple-400">pengerjaan</span>:{" "}
                <span className="text-yellow-400">'tepat waktu'</span>,
              </div>
              <div className="pl-8 md:pl-12 whitespace-pre">
                <span className="text-purple-400">kepuasan</span>:{" "}
                <span className="text-yellow-400">'terjamin'</span>,
              </div>
              <div className="pl-8 md:pl-12 whitespace-pre">
                <span className="text-purple-400">dukungan</span>:{" "}
                <span className="text-yellow-400">'24/7'</span>
              </div>
              <div className="pl-4 md:pl-6 whitespace-pre">{"}"}</div>
              <div className="whitespace-pre">{"}"}</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Improved scroll indicator with subtle animation */}
      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <div className="h-10 w-6 border-2 border-gray-400 rounded-full relative">
            <div className="absolute w-2 h-2 bg-blue-400 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
