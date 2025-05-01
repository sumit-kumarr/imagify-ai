
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromptInput from "@/components/PromptInput";
import ImageGallery from "@/components/ImageGallery";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@/hooks/useAuth";
import { useImages } from "@/hooks/useImages";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, User } from "lucide-react";

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();
  const { images, saveImage } = useImages();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  
  const demoImages = [
    { 
      url: "https://images.unsplash.com/photo-1655720828018-7467e7fa7c92?q=80&w=1287&auto=format&fit=crop",
      prompt: "A futuristic city with flying vehicles and neon lights" 
    },
    { 
      url: "https://images.unsplash.com/photo-1675254627304-5c9a37fe1838?q=80&w=1287&auto=format&fit=crop",
      prompt: "A fantasy landscape with magical creatures" 
    },
    { 
      url: "https://images.unsplash.com/photo-1676918555354-c2be7c7b3917?q=80&w=1287&auto=format&fit=crop",
      prompt: "An underwater scene with colorful fish and coral" 
    }
  ];
  
  // Sample gallery of demo images
  const [galleryImages, setGalleryImages] = useState(demoImages);
  
  const handleGenerateStart = () => {
    setIsGenerating(true);
  };
  
  const handleGenerateComplete = async (url: string, prompt: string) => {
    setImageUrl(url);
    setCurrentPrompt(prompt);
    setIsGenerating(false);
    
    // Add the new image to the beginning of the gallery
    setGalleryImages([{ url, prompt }, ...galleryImages.slice(0, 5)]);
    
    // If user is logged in, save the image
    if (user) {
      await saveImage(url, prompt);
    }
  };
  
  // Animation variants
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
        style={{ opacity, scale }}
      >
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
            Turn your imagination into visual art with our powerful AI image generator. Simply describe what you want to see, and watch the magic happen.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <PromptInput 
              onGenerateStart={handleGenerateStart}
              onGenerateComplete={handleGenerateComplete}
            />
          </motion.div>
          
          {!user && (
            <motion.div 
              variants={itemVariants}
              className="mt-6"
            >
              <Link to="/login">
                <Button variant="outline" className="gap-2">
                  <User size={16} />
                  <span>Login to save your creations</span>
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
      </motion.div>
      
      {/* Main content */}
      <div className="container max-w-7xl mx-auto px-4 py-20">
        {/* Generated image or loading spinner */}
        {isGenerating ? (
          <div className="mb-16">
            <LoadingSpinner />
          </div>
        ) : (
          imageUrl && (
            <motion.div 
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Your Creation</h2>
              <div className="max-w-3xl mx-auto bg-card rounded-lg overflow-hidden shadow-lg">
                <img src={imageUrl} alt={currentPrompt} className="w-full h-auto" />
                <div className="p-4 text-left">
                  <p className="text-sm text-muted-foreground">{currentPrompt}</p>
                </div>
              </div>
            </motion.div>
          )
        )}
        
        {/* Gallery section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recent Creations</h2>
            {user && (
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <span>View All</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </div>
          
          <ImageGallery 
            images={galleryImages.map((img, index) => ({
              ...img,
              id: `demo-${index}`,
            }))} 
            onRegenerate={(prompt) => {
              setCurrentPrompt(prompt);
              setIsGenerating(true);
              // Simulate regeneration (in a real app, this would call the API again)
              setTimeout(() => {
                handleGenerateComplete(galleryImages[0].url, prompt);
              }, 2000);
            }}
          />
        </div>
      </div>
      
      {/* Features Section */}
      <section className="bg-muted py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-muted-foreground">
                State-of-the-art AI algorithms that transform text into stunning visual art in seconds.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unlimited Generations</h3>
              <p className="text-muted-foreground">
                Create as many images as you like. Tweak your prompt until you get the perfect result.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Share</h3>
              <p className="text-muted-foreground">
                Save your creations to your account and easily share them with friends and on social media.
              </p>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/register">
              <Button className="bg-gradient-main hover:opacity-90">Create Your Account</Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
