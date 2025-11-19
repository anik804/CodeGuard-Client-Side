import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AnimatedButton = ({
  children,
  variant = "primary", // primary, secondary, gradient, outline
  size = "md", // sm, md, lg
  icon = null,
  iconPosition = "right", // left, right
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses = "font-semibold rounded-2xl transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2";
  
  const sizeClasses = {
    sm: "px-6 py-2.5 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-5 text-lg"
  };

  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl",
    secondary: "bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/20",
    gradient: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-indigo-500/50",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
  };

  const IconComponent = icon || (variant === "primary" || variant === "gradient" ? ArrowRight : null);

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {IconComponent && iconPosition === "left" && (
          <motion.div
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <IconComponent className="w-5 h-5" />
          </motion.div>
        )}
        {children}
        {IconComponent && iconPosition === "right" && (
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <IconComponent className="w-5 h-5" />
          </motion.div>
        )}
      </span>
      {(variant === "primary" || variant === "gradient") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 hover:opacity-100 transition-opacity"
          initial={false}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton;

