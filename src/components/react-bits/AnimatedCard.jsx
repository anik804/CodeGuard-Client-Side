import { motion } from "framer-motion";
import { useState } from "react";

const AnimatedCard = ({
  children,
  className = "",
  hoverEffect = true,
  gradient = false,
  gradientColors = "from-indigo-500/10 via-purple-500/10 to-pink-500/10",
  delay = 0,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative rounded-2xl bg-card border border-border shadow-lg transition-all duration-500 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
      whileHover={hoverEffect ? { y: -8, scale: 1.02 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {gradient && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradientColors} opacity-0 transition-opacity duration-500`}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
      {hoverEffect && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "left" }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedCard;

