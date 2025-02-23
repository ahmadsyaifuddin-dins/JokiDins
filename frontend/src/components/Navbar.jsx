import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

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
        { name: 'Tentang Kami', href: '/about' }
      ];
    }

    if (user.role === 'admin') {
      return [
        { name: 'Home', href: '/' },
        {
          name: 'Manajemen Order',
          href: '#',
          children: [
            { name: 'Daftar Order', href: '/admin/orders' },
            { name: 'Order Masuk', href: '/admin/orders/pending' },
            { name: 'Order Diproses', href: '/admin/orders/processing' },
            { name: 'Order Selesai', href: '/admin/orders/completed' }
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
          { name: 'Pesanan Saya', href: '/orders' }
        ]
      },
      { name: 'Tentang Kami', href: '/about' },
      { name: 'Profile', href: '/profile' }
    ];
  };

  const navigation = getNavigation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <span className="text-2xl font-bold text-blue-900">JokiDins 😉</span>
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
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200 origin-top ${
                        activeDropdown === item.name 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
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
                    </div>
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
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'opacity-100 max-h-screen' 
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}
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
                    <ChevronDown 
                      className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-200 ${
                      activeDropdown === item.name 
                        ? 'max-h-48 opacity-100' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
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
                  </div>
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
      </div>
    </nav>
  );
};

export default Navbar;