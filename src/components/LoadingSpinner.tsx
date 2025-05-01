
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

const LoadingSpinner = ({ size = 64, text = "Creating your masterpiece..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <div 
          className="absolute inset-0 border-4 border-primary/20 rounded-full"
        />
        <motion.div 
          className="absolute inset-0 border-4 border-t-primary border-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      {text && (
        <motion.p 
          className="mt-4 text-muted-foreground text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
