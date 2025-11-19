import { motion } from "framer-motion";

const AnimatedBadge = ({
  children,
  icon: Icon,
  variant = "default", // default, gradient, outline, glow
  size = "md", // sm, md, lg
  className = "",
  delay = 0
}) => {
  const baseClasses = "inline-flex items-center gap-2 rounded-full font-semibold backdrop-blur-md border";
  
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  const variantClasses = {
    default: "bg-gray-100 text-gray-900 border-gray-200",
    gradient: "bg-gradient-to-r from-black via-gray-900 to-gray-700 text-white border-transparent shadow-lg",
    outline: "bg-transparent border-white/30 text-white",
    glow: "bg-black/40 border-white/20 text-white shadow-lg shadow-black/40"
  };

  return (
    <motion.div
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ scale: 1.1 }}
    >
      {Icon && (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Icon className="w-4 h-4" />
        </motion.div>
      )}
      {children}
    </motion.div>
  );
};

export default AnimatedBadge;

