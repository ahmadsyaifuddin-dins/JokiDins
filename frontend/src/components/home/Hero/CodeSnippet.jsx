// CodeSnippet.jsx
import React from "react";
import { motion } from "framer-motion";

const CodeSnippet = () => {
  return (
    <motion.div
      className="mt-auto mb-8 block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="relative bg-gray-900/80 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-gray-800/80 shadow-2xl transform hover:scale-105 transition-all duration-500 max-w-3xl mx-auto code-snippet">
        <div className="flex items-center gap-2 mb-2 md:mb-4">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-400 text-xs md:text-sm ml-2">jokidins.jsx</span>
        </div>
        <div className="font-mono text-left text-xs md:text-sm text-gray-300 overflow-x-auto pb-2">
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
  );
};

export default CodeSnippet;
