// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
      {/* Logo + Name with animation */}
      <motion.div
        className="flex items-center gap-3 cursor-pointer"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 120 }}
        onClick={() => navigate("/")}
      >
        <motion.img
          src={logo}
          alt="Logo"
          className="w-14 h-14"
          whileHover={{ rotate: 20 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <motion.div
          className="text-2xl font-bold"
          initial={{ color: "#4B5563" }}
          animate={{ color: ["#4B5563", "#6366F1", "#EC4899", "#4B5563"] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          CodeGuard
        </motion.div>
      </motion.div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
        <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
        <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
        <Button variant="default" size="sm" onClick={() => navigate("/auth/login")}>
          Login
        </Button>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 focus:outline-none"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          <Link to="/" className="text-gray-700 hover:text-gray-900" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-gray-900" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-gray-900" onClick={() => setIsOpen(false)}>Contact</Link>
          <Button variant="default" size="sm" onClick={() => { setIsOpen(false); navigate("/login"); }}>
            Login
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
