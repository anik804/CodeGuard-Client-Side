import { motion } from "framer-motion";

const GlowEffect = ({
  children,
  color = "indigo",
  intensity = "medium", // low, medium, high
  className = ""
}) => {
  const colorClasses = {
    indigo: "shadow-indigo-500/50",
    purple: "shadow-purple-500/50",
    pink: "shadow-pink-500/50",
    blue: "shadow-blue-500/50"
  };

  const intensityClasses = {
    low: "shadow-lg",
    medium: "shadow-xl",
    high: "shadow-2xl"
  };

  return (
    <motion.div
      className={`${intensityClasses[intensity]} ${colorClasses[color]} ${className}`}
      animate={{
        boxShadow: [
          `0 0 20px rgba(99, 102, 241, 0.3)`,
          `0 0 40px rgba(99, 102, 241, 0.5)`,
          `0 0 20px rgba(99, 102, 241, 0.3)`,
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlowEffect;

