// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// const AnimatedText = ({ 
//   text, 
//   className = "",
//   delay = 0,
//   type = "fadeIn", 
//   duration = 0.5,
//   stagger = 0.05
// }) => {
//   const [displayText, setDisplayText] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (type === "typewriter") {
//       if (currentIndex < text.length) {
//         const timeout = setTimeout(() => {
//           setDisplayText(text.slice(0, currentIndex + 1));
//           setCurrentIndex(currentIndex + 1);
//         }, 50);
//         return () => clearTimeout(timeout);
//       }
//     } else {
//       setDisplayText(text);
//     }
//   }, [text, currentIndex, type]);

//   const variants = {
//     fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
//     slideUp: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
//     slideDown: { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } },
//     slideLeft: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
//     slideRight: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
//     scale: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }
//   };

//   // ----------------------------
//   // ✅ FIX 1: Preserve spaces in char mode
//   // ----------------------------
//   const splitCharsPreserveSpace = (str) => str.split(/(\s+)/);

//   // ----------------------------
//   // ✅ FIX 2: Preserve spaces in word mode (multiple spaces)
//   // ----------------------------
//   const splitWordsPreserveSpace = (str) => str.split(/(\s+)/);

//   if (type === "typewriter") {
//     return (
//       <motion.span
//         className={className}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.3, delay }}
//       >
//         {displayText}
//         <motion.span
//           animate={{ opacity: [1, 0] }}
//           transition={{ duration: 0.8, repeat: Infinity }}
//         >
//           |
//         </motion.span>
//       </motion.span>
//     );
//   }

//   if (type === "word" || type === "char") {
//     const items =
//       type === "word"
//         ? splitWordsPreserveSpace(text)
//         : splitCharsPreserveSpace(text);

//     return (
//       <span className={className}>
//         {items.map((item, index) => (
//           <motion.span
//             key={index}
//             initial="hidden"
//             animate="visible"
//             variants={variants.fadeIn}
//             transition={{
//               duration,
//               delay: delay + index * stagger,
//             }}
//             className="inline-block"
//           >
//             {item}
//           </motion.span>
//         ))}
//       </span>
//     );
//   }

//   return (
//     <motion.span
//       className={className}
//       initial="hidden"
//       animate="visible"
//       variants={variants[type] || variants.fadeIn}
//       transition={{ duration, delay }}
//     >
//       {displayText}
//     </motion.span>
//   );
// };

// export default AnimatedText;

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedText = ({
  text,
  className = "",
  delay = 0,
  type = "fadeIn", 
  duration = 0.5,
  stagger = 0.05,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (type === "typewriter") {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 50);
        return () => clearTimeout(timeout);
      }
    } else {
      setDisplayText(text);
    }
  }, [text, currentIndex, type]);

  // Animation variants
  const variants = {
    fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    slideUp: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
    slideDown: { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } },
    slideLeft: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
    slideRight: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
  };

  // **WORD ANIMATION FIX WITH SPACES**
  if (type === "word") {
    const items = text.split(/(\s+)/); // keep spaces intact

    return (
      <span className={className}>
        {items.map((item, index) => (
          <motion.span
            key={index}
            initial="hidden"
            animate="visible"
            variants={variants.fadeIn}
            transition={{
              duration,
              delay: delay + index * stagger,
            }}
            className="inline-block whitespace-pre"
          >
            {item}
          </motion.span>
        ))}
      </span>
    );
  }

  // Character animation
  if (type === "char") {
    const chars = text.split("");

    return (
      <span className={className}>
        {chars.map((c, index) => (
          <motion.span
            key={index}
            initial="hidden"
            animate="visible"
            variants={variants.fadeIn}
            transition={{
              duration,
              delay: delay + index * stagger,
            }}
            className="inline-block whitespace-pre"
          >
            {c}
          </motion.span>
        ))}
      </span>
    );
  }

  // Normal fade/slide/scale
  return (
    <motion.span
      className={`${className} whitespace-pre-line`}
      initial="hidden"
      animate="visible"
      variants={variants[type] || variants.fadeIn}
      transition={{ duration, delay }}
    >
      {displayText}
    </motion.span>
  );
};

export default AnimatedText;

