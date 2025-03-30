import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import '../styles/navbar.css'; // Import CSS yang baru

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? '' : menu);
  };

  // Define navigation items based on user role
  const getNavigation = () => {
    if (!user) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Harga Joki', href: '/pricing' },
        { name: 'Kontak', href: '/contact' },
        { name: 'Tentang Kami', href: '/about' },
        { name: `Syaifuddin's Project Progress`, href: 'https://dins-sphere.vercel.app' }
      ];
    }

    if (user.role === 'admin') {
      return [
        { name: 'Home', href: '/' },
        {
          name: 'Manajemen Data',
          href: '#',
          children: [
            { name: 'Data Kostumer', href: '/admin/Users' },
            { name: 'Daftar Order', href: '/OrderList' },
            { name: 'Pendapatan', href: '/pendapatan' }
          ]
        },
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Harga Joki', href: '/pricing' },
        { name: 'Kontak', href: '/contact' },
        { name: 'Tentang Kami', href: '/about' },
        { name: `Syaifuddin's Project Progress`, href: 'https://dins-sphere.vercel.app' },
        { name: 'Profile', href: '/admin/profile' }
      ];
    }

    // Regular user navigation
    return [
      { name: 'Home', href: '/' },
      {
        name: 'Layanan Joki',
        href: '#',
        children: [
          { name: 'Pesan Joki', href: '/create-order' },
          { name: 'Pesanan Saya', href: '/OrderList' },
          { name: 'Syaifuddin Progress', href: 'https://dins-sphere.vercel.app' } 
        ]
      },
      { name: 'Harga Joki', href: '/pricing' },
      { name: 'Kontak', href: '/contact' },
      { name: 'Tentang Kami', href: '/about' },
      { name: 'Profile', href: '/profile' }
    ];
  };

  const navigation = getNavigation();

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -5,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const mobileDropdownVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <nav className="bg-slate-950 shadow-xl sticky top-0 z-20 border-b border-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <div className="flex items-center">
                  <img src="/images/JokiDins-new_transparent.png" alt="JokiDins Logo" className="h-14 w-14 md:h-16 md:w-16 mr-2" />
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">JokiDins</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      {item.name}
                      <motion.div
                        animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                          className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-slate-950 ring-1 ring-slate-950 ring-opacity-50 backdrop-blur-sm overflow-hidden"
                        >
                          <div className="py-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-950 hover:text-blue-400 transition-colors duration-200"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {user ? (
              <button 
                onClick={logout} 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md">
                    Masuk
                  </button>
                </Link>
                <Link to="/register">
                  <button className="border border-blue-500 bg-transparent text-blue-400 hover:bg-blue-900/30 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md">
                    Daftar
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Custom Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <label className="hamburger md:hidden relative z-20 text-gray-300">
              <input 
                type="checkbox" 
                checked={isOpen}
                onChange={() => setIsOpen(!isOpen)}
              />
              <svg viewBox="0 0 32 32">
                <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                <path className="line" d="M7 16 27 16"></path>
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden bg-slate-950"
          >
            <div className="px-3 pt-3 pb-4 space-y-2 border-t border-slate-950">
              {navigation.map((item) => (
                <div key={item.name} className="rounded-md overflow-hidden">
                  {item.children ? (
                    <div className="bg-slate-950/60">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="w-full flex items-center justify-between text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      >
                        {item.name}
                        <motion.div
                          animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={mobileDropdownVariants}
                            className="bg-slate-950/50"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="block pl-6 py-2 text-base text-gray-300 hover:text-blue-400 transition-colors duration-200"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {user ? (
                <button 
                  onClick={logout} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 mt-4 shadow-md"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-row gap-4 mt-4">
                  <Link to="/login" className="w-full">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md">
                      Masuk
                    </button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <button className="w-full border border-blue-500 bg-transparent text-blue-400 hover:bg-blue-900/30 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md">
                      Daftar
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
