import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CardSwap = ({
  cards = [],
  autoSwap = true,
  swapInterval = 5000,
  showControls = true,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextCard = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const goToCard = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Auto-swap functionality
  useEffect(() => {
    if (autoSwap && cards.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % cards.length);
      }, swapInterval);
      return () => clearInterval(interval);
    }
  }, [autoSwap, cards.length, swapInterval]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "400px" }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {cards[activeIndex] && (
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  nextCard();
                } else if (swipe > swipeConfidenceThreshold) {
                  prevCard();
                }
              }}
              className="absolute inset-0"
            >
              {cards[activeIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {showControls && cards.length > 1 && (
        <>
          {/* Previous Button */}
          <motion.button
            onClick={prevCard}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/80 dark:bg-background/80 backdrop-blur-md border border-border text-foreground hover:bg-background transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous card"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Next Button */}
          <motion.button
            onClick={nextCard}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/80 dark:bg-background/80 backdrop-blur-md border border-border text-foreground hover:bg-background transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next card"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-background/60 dark:bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            {cards.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToCard(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "bg-indigo-600 dark:bg-indigo-400 w-8"
                    : "bg-muted-foreground/40 hover:bg-muted-foreground/60 w-2"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardSwap;

