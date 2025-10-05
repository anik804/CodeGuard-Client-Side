
import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-3">
        
        {/* Logo + Website Name in flex */}
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Logo with bouncing animation */}
          <motion.img
            src={logo}
            alt="Logo"
            className="w-12 h-12"
            animate={{
              y: [0, -5, 0], // small up-down movement
              rotate: [0, 5, -5, 0], // little rotation swing
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Heading with animated color */}
          <motion.h1
            className="text-3xl font-bold tracking-wider"
            animate={{
              color: ["#ffffff", "#3b82f6", "#22c55e", "#ffffff"], // white → blue → green → white
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            CodeGuard
          </motion.h1>
        </motion.div>

        {/* Credit Text with fade-in */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-sm text-gray-400"
        >
          Created by <span className="font-semibold">IIUC-CSE Department Student</span>
        </motion.p>

        {/* Underline animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80%" }}
          transition={{ duration: 1.5 }}
          className="h-0.5 bg-gradient-to-r from-blue-500 via-green-400 to-blue-500 mt-2"
        />
      </div>
    </footer>
  );
};

export default Footer;

