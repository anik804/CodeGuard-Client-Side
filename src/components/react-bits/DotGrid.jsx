import { motion } from "framer-motion";
import { useMemo } from "react";

const DotGrid = ({
  dotColor = "rgba(255, 255, 255, 0.1)",
  dotSize = 2,
  spacing = 40,
  animate = true,
  className = "",
}) => {
  const dots = useMemo(() => {
    const dotsArray = [];
    // Calculate based on viewport size for better performance
    const rows = Math.ceil(window.innerHeight / spacing) + 2;
    const cols = Math.ceil(window.innerWidth / spacing) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dotsArray.push({
          id: `${row}-${col}`,
          x: col * spacing,
          y: row * spacing,
        });
      }
    }
    return dotsArray;
  }, [spacing]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {dots.map((dot) => (
          <motion.circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r={dotSize}
            fill={dotColor}
            animate={animate ? {
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default DotGrid;

