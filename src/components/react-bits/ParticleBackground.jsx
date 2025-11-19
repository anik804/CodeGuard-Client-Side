import { motion } from "framer-motion";
import { useMemo } from "react";

const ParticleBackground = ({ 
  count = 50,
  colors = ["rgba(255,255,255,0.35)", "rgba(200,200,200,0.3)", "rgba(160,160,160,0.25)"],
  sizeRange = [2, 6],
  speedRange = [20, 60]
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
      delay: Math.random() * 2,
    }));
  }, [count, colors, sizeRange, speedRange]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;

