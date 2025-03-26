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

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    services: false,
    platform: false,
    features: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Check if sections are visible for animations
      const servicesSection = document.getElementById("services-section");
      const platformSection = document.getElementById("platform-section");
      const featuresSection = document.getElementById("features-section");

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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white overflow-hidden">
      
      {/* Hero Section - Enhanced with particle effects and better animations */}
      <Hero />

      {/* Services Section - Improved card design and animations */}
      <Services isVisible={isVisible.services} />

      <Timeline />

      {/* Platform Section - Enhanced with better animations */}
      <Platform isVisible={isVisible.platform}/>

      {/* Stats Section (New) */}
      <Stats />

      {/* Testimonials Section (New) */}
      <Testimonials isVisible={isVisible.testimonials} scrollY={scrollY} />

      <Features isVisible={isVisible.features} scrollY={scrollY} />

    </div>
  );
};

export default Home;
