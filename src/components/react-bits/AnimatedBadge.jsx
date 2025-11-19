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
    default: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg",
    outline: "bg-white/10 border-white/20 text-white",
    glow: "bg-indigo-500/20 border-indigo-400/50 text-indigo-300 shadow-lg shadow-indigo-500/50"
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

