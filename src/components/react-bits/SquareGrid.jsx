import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const SquareGrid = ({
  squareColor = "rgba(255, 255, 255, 0.1)",
  squareSize = 20,

  spacing = 40,
  animate = true,
  className = "",
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const squares = useMemo(() => {
    const squaresArray = [];
    const rows = Math.ceil(dimensions.height / spacing) + 2;
    const cols = Math.ceil(dimensions.width / spacing) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        squaresArray.push({
          id: `${row}-${col}`,
          x: col * spacing,
          y: row * spacing,
        });
      }
    }
    return squaresArray;
  }, [spacing, dimensions]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {squares.map((square) => (
          <motion.rect
            key={square.id}
            x={square.x - squareSize / 2}
            y={square.y - squareSize / 2}
            width={squareSize}
            height={squareSize}
            fill="none"
            stroke={squareColor}
            strokeWidth={1}
            animate={animate ? {
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default SquareGrid;

