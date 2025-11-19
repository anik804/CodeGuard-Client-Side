import { motion } from "framer-motion";

const GradientText = ({ 
  children, 
  className = "", 
  gradient = "from-white via-gray-200 to-white",
  animate = true,
  size = "text-4xl"
}) => {
  const gradientClasses = `bg-gradient-to-r ${gradient} bg-clip-text text-transparent`;
  
  if (animate) {
    return (
      <motion.span
        className={`${gradientClasses} ${size} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundSize: "200% 200%",
          animation: "gradient-shift 8s ease infinite",
        }}
      >
        {children}
        <style>{`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      </motion.span>
    );
  }
  
  return (
    <span className={`${gradientClasses} ${size} ${className}`}>
      {children}
    </span>
  );
};

export default GradientText;

