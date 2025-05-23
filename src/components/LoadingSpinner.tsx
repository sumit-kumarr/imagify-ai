
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  className?: string;
  color?: string;
}

const LoadingSpinner = ({ 
  size = 64, 
  text = "Loading...", 
  className = "",
  color = "primary"
}: LoadingSpinnerProps) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center p-4 ${className}`} 
      style={{ minHeight: size * 1.5 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <div 
          className={`absolute inset-0 border-4 border-${color}/10 rounded-full`}
        />
        
        {/* Spinning gradient border */}
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{
            borderWidth: 4,
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderTopColor: `hsl(var(--${color}))`,
            borderRightColor: `hsl(var(--${color}) / 0.3)`
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute"
          style={{ 
            top: '50%', 
            left: '50%', 
            width: size * 0.15, 
            height: size * 0.15, 
            marginLeft: -(size * 0.15)/2, 
            marginTop: -(size * 0.15)/2, 
            borderRadius: '50%',
            backgroundColor: `hsl(var(--${color}))`
          }}
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {text && (
        <motion.p 
          className="mt-4 text-muted-foreground text-center text-sm"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
