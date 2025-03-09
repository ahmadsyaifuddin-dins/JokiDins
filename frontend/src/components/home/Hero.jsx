import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

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
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
      </div>

      {/* Enhanced glowing orbs with better blur effect */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500 rounded-full filter blur-[150px] opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500 rounded-full filter blur-[150px] opacity-20 animate-pulse-slower"></div>
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-purple-500 rounded-full filter blur-[120px] opacity-10 animate-pulse"></div>

      {/* Content Container with improved animations */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 tracking-tight mb-6">
            JokiDins
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8">
            Solusi cerdas untuk tugas dan proyekmu. Kami hadir untuk membantu
            mewujudkan hasil terbaik!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-order">
              <button className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Order Joki
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/contact">
              <button className="w-full sm:w-auto bg-gray-900 text-white border border-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transform hover:-translate-y-1 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10">
                Kontak Kami
              </button>
            </Link>
          </div>
        </div>

        {/* Enhanced code snippet preview with better 3D effect and syntax highlighting */}
        <div className="mt-5 mb-8 block animate-fade-in-delayed">
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
                <span className="text-yellow-400">'premium'</span>,
              </div>
              <div className="pl-8 md:pl-12 whitespace-pre">
                <span className="text-purple-400">Pengerjaan</span>:{" "}
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
        </div>
      </div>

      {/* Improved scroll indicator with subtle animation */}
      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <div className="h-10 w-6 border-2 border-gray-400 rounded-full relative">
            <div className="absolute top-1 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 animate-scroll-indicator"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
