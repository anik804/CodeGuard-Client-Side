// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center relative z-50">
      {/* Logo + Name */}
      <motion.div
        className="flex items-center gap-3 cursor-pointer"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 120 }}
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
        {navLinks.map((link, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to={link.path}
              className="relative text-gray-700 font-medium hover:text-indigo-600 transition-colors duration-200 group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
            </Link>
          </motion.div>
        ))}

        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring" }}>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md font-semibold transition-all duration-200"
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
          className="text-gray-800 focus:outline-none"
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

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg flex flex-col items-center gap-4 py-5 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {navLinks.map((link, index) => (
          <motion.div key={index} whileTap={{ scale: 0.95 }}>
            <Link
              to={link.path}
              className="text-gray-800 font-medium hover:text-indigo-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          </motion.div>
        ))}

        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg shadow-md font-semibold transition-all duration-200"
          onClick={() => {
            setIsOpen(false);
            navigate("/auth/login");
          }}
        >
          Login
        </Button>
      </motion.div>
    </nav>
  );
};

export default Navbar;
