import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? '' : menu);
  };

  // Define navigation items based on user role
  const getNavigation = () => {
    if (!user) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Kontak', href: '/contact' },
        { name: 'Tentang Kami', href: '/about' },
        { name: `Syaifuddin's Project Progress` , href: 'https://dins-sphere.vercel.app' }
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
          ]
        },
        { name: 'Dashboard', href: '/admin/dashboard' },
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
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const mobileDropdownVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <div className="flex items-center">
                  <img src="/logo.svg" alt="JokiDins Logo" className="h-8 w-8 mr-2" />
                  <span className="text-2xl font-bold text-blue-900">JokiDins </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center text-gray-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
                          className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        >
                          <div className="py-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
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
                    className="text-gray-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {user ? (
              <button 
                onClick={logout} 
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                    Masuk
                  </button>
                </Link>
                <Link to="/register">
                  <button className="border border-blue-900 bg-white text-blue-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200">
                    Daftar
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
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
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="w-full flex items-center justify-between text-gray-600 hover:text-blue-900 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
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
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className="block pl-6 py-2 text-base text-gray-600 hover:text-blue-900 transition-colors duration-200"
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
                      className="block text-gray-600 hover:text-blue-900 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {user ? (
                <button 
                  onClick={logout} 
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200 mt-4"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-row gap-5">
                  <Link to="/login" className="w-full">
                    <button className="w-full bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                      Masuk
                    </button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <button className="w-full border border-blue-900 bg-white text-blue-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200">
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