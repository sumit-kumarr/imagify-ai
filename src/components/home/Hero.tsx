
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";
import PromptInput from "@/components/PromptInput";
import { useUser } from "@/hooks/useAuth";

interface HeroProps {
  isGenerating: boolean;
  onGenerateStart: () => void;
  onGenerateComplete: (url: string, prompt: string) => void;
}

const Hero = ({ isGenerating, onGenerateStart, onGenerateComplete }: HeroProps) => {
  const { user } = useUser();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-background to-background z-0" />
      
      {/* Hero content */}
      <motion.div 
        className="z-10 text-center max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-main text-transparent bg-clip-text animate-gradient-move"
          variants={itemVariants}
        >
          Generate Stunning AI Images From Text
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground mb-10"
          variants={itemVariants}
        >
          Turn your imagination into visual art with our powerful AI image generator. 
          Simply describe what you want to see, and watch the magic happen.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <PromptInput 
            onGenerateStart={onGenerateStart}
            onGenerateComplete={onGenerateComplete}
          />
        </motion.div>
        
        {!user && (
          <motion.div 
            variants={itemVariants}
            className="mt-6 flex gap-4 justify-center"
          >
            <Link to="/login">
              <Button variant="default" className="gap-2">
                <User size={16} />
                <span>Sign In</span>
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="gap-2">
                <span>Create Account</span>
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight size={24} className="rotate-90 text-muted-foreground" />
      </motion.div>
    </div>
  );
};

export default Hero;
