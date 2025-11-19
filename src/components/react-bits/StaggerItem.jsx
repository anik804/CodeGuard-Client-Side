import { motion } from "framer-motion";

const StaggerItem = ({
  children,
  className = "",
  variant = "fadeUp", // fadeUp, fadeDown, scale, slideLeft, slideRight
  ...props
}) => {
  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    },
    fadeDown: {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants[variant] || variants.fadeUp}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default StaggerItem;

