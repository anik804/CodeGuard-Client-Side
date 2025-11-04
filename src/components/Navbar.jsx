// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection for sticky background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo + Name */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
        >
          <motion.img
            src={logo}
            alt="Logo"
            className="w-12 h-12 drop-shadow-md"
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <motion.span
            className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            CodeGuard
          </motion.span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to={link.path}
                  className={`relative font-medium transition-colors duration-200 group ${
                    isScrolled
                      ? isActive
                        ? "text-transparent bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 bg-clip-text"
                        : "text-gray-700 hover:text-indigo-600"
                      : isActive
                      ? "text-transparent bg-gradient-to-r from-indigo-300 via-pink-300 to-purple-300 bg-clip-text"
                      : "text-lime-400 hover:text-indigo-300"
                  }`}
                >
                  {link.name}

                  {/* Underline animation */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600"
                        : "w-0 group-hover:w-full " +
                          (isScrolled ? "bg-indigo-500" : "bg-white")
                    }`}
                  ></span>
                </Link>
              </motion.div>
            );
          })}

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring" }}>
            <Button
              size="lg"
              className={`px-6 py-2 rounded-lg shadow-md font-semibold transition-all duration-200 ${
                isScrolled
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white/20 text-white border border-white hover:bg-white/30"
              }`}
              onClick={() => navigate("/auth/login")}
            >
              Login
            </Button>
          </motion.div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`focus:outline-none ${
              isScrolled ? "text-gray-800" : "text-white"
            }`}
          >
            {isOpen ? (
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ rotate: 0 }}
                animate={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </motion.svg>
            ) : (
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </motion.svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`absolute top-[72px] left-0 w-full ${
          isScrolled ? "bg-white/95 backdrop-blur-md" : "bg-black/80"
        } shadow-lg flex flex-col items-center gap-4 py-5 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {navLinks.map((link, index) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.div key={index} whileTap={{ scale: 0.95 }}>
              <Link
                to={link.path}
                className={`font-medium transition-colors duration-200 ${
                  isScrolled
                    ? isActive
                      ? "text-transparent bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 bg-clip-text"
                      : "text-gray-800 hover:text-indigo-600"
                    : isActive
                    ? "text-transparent bg-gradient-to-r from-indigo-300 via-pink-300 to-purple-300 bg-clip-text"
                    : "text-white hover:text-indigo-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </motion.div>
          );
        })}

        <Button
          size="lg"
          className={`px-8 py-2 rounded-lg shadow-md font-semibold transition-all duration-200 ${
            isScrolled
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-white/20 text-white border border-white hover:bg-white/30"
          }`}
          onClick={() => {
            setIsOpen(false);
            navigate("/auth/login");
          }}
        >
          Login
        </Button>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
