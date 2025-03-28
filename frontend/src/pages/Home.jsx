import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Book,
  Palette,
  ArrowRight,
  Clock,
  Star,
  Shield,
  ChevronRight,
  MessageSquare,
  Users,
  CheckCircle,
} from "lucide-react";
import Features from "../components/home/Features";
import Testimonials from "../components/home/Testimonials";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Platform from "../components/home/Platform";
import Stats from "../components/home/Stats";
import Timeline from "../components/home/Timeline";
import MapComponent from "../components/home/MapComponent"; // import mini map komponen

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    services: false,
    platform: false,
    features: false,
    testimonials: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Check if sections are visible for animations
      const servicesSection = document.getElementById("services-section");
      const platformSection = document.getElementById("platform-section");
      const featuresSection = document.getElementById("features-section");
      const testimonialsSection = document.getElementById(
        "testimonials-section"
      );

      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect();
        setIsVisible((prev) => ({
          ...prev,
          services: rect.top < window.innerHeight - 100,
        }));
      }

      if (platformSection) {
        const rect = platformSection.getBoundingClientRect();
        setIsVisible((prev) => ({
          ...prev,
          platform: rect.top < window.innerHeight - 100,
        }));
      }

      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        setIsVisible((prev) => ({
          ...prev,
          features: rect.top < window.innerHeight - 100,
        }));
      }

      if (testimonialsSection) {
        const rect = testimonialsSection.getBoundingClientRect();
        setIsVisible((prev) => ({
          ...prev,
          testimonials: rect.top < window.innerHeight - 100,
        }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Mini Map Section */}
      <div className="my-12 px-4 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
        <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-blue-400 text-sm font-medium mb-4 inline-block shadow-lg shadow-blue-900/10">
            Mitra & Cabang
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 py-2 leading-tight">
            Explore JokiDins Network
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Lihat dan temukan cabang dan mitra JokiDins yang tersedia di Seluruh Indonesia
          </p>
          </div>
          <div className="border-2 border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
            <MapComponent />
          </div>
          <div className="flex justify-center mt-6">
            <Link
              to="/full-map"
              className="
          px-6 py-3 
          bg-gradient-to-r from-cyan-500 to-blue-500 
          text-white 
          rounded-full 
          hover:from-cyan-600 hover:to-blue-600 
          transition-all 
          duration-300 
          flex items-center 
          space-x-2
          shadow-lg
          hover:shadow-xl
        "
            >
              <span>View Full Map</span>
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <Services isVisible={isVisible.services} />

      <Timeline />

      {/* Platform Section */}
      <Platform isVisible={isVisible.platform} />

      {/* Stats Section */}
      <Stats />

      {/* Testimonials Section */}
      <Testimonials isVisible={isVisible.testimonials} scrollY={scrollY} />

      {/* Features Section */}
      <Features isVisible={isVisible.features} scrollY={scrollY} />
    </div>
  );
};

export default Home;
