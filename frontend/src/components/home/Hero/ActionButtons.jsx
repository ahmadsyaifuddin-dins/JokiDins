// ActionButtons.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const ActionButtons = () => {
  return (
    <div className="flex gap-2 md:gap-4 justify-center">
      <Link to="/create-order">
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
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-600 to-blue-600 opacity-80"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <motion.span
            className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-pink-600/30 to-blue-500/30 blur-md rounded-lg"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
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
            style={{ width: "50%", skewX: "-20deg" }}
          />
          <span className="relative z-10 flex items-center justify-center gap-1 md:gap-2">
            <span className="text-white text-base">Order Joki</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </motion.span>
          </span>
        </motion.button>
      </Link>
      <Link to="/contact">
        <motion.button
          className="bg-gray-900 text-white border border-gray-700 px-4 py-4 rounded-lg font-medium flex items-center justify-center gap-2"
          whileHover={{
            y: -4,
            borderColor: "rgba(59, 130, 246, 0.5)",
            boxShadow: "0 10px 15px -3px rgba(30, 64, 175, 0.1)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Kontak
          <motion.span whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
            <MessageSquare className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </Link>
    </div>
  );
};

export default ActionButtons;
