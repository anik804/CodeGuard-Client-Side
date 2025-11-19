import { motion } from "framer-motion";

const GradientBackground = ({ 
  gradients = [
    "from-indigo-500/20 via-purple-500/20 to-pink-500/20",
    "from-blue-500/20 via-cyan-500/20 to-teal-500/20"
  ],
  animate = true,
  className = ""
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {gradients.map((gradient, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-3xl`}
          animate={animate ? {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          } : {}}
          transition={{
            duration: 15 + index * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2,
          }}
          style={{
            transformOrigin: index % 2 === 0 ? "top left" : "bottom right",
          }}
        />
      ))}
    </div>
  );
};

export default GradientBackground;

