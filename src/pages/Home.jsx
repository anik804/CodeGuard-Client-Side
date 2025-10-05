import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <section
      className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden"
      style={{
        backgroundImage: `url('https://i.ibb.co.com/TxBhXYq4/c1-DYNu0y-B7.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <motion.div
        className="relative z-10 max-w-3xl px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
          initial={{ backgroundPosition: "200% 0%" }}
          animate={{ backgroundPosition: ["200% 0%", "0% 200%", "200% 0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          Welcome to <span className="font-extrabold">CodeGuard</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-8 font-medium text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          A next-gen screen monitoring solution for online exams. Share your
          screen in real-time, prevent cheating, and ensure a fair, transparent
          testing environment.
        </motion.p>

        <motion.button
          className="px-6 py-3 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg"
          whileHover={{
            scale: 1.1,
            backgroundColor: "#9333ea", // purple
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          Get Started
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-indigo-500/40 rounded-full blur-xl"
        animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-pink-500/40 rounded-full blur-2xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </section>
  );
};

export default Home;
