
import { useState, useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/hooks/useAuth";
import { useImages } from "@/hooks/useImages";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import Hero from "@/components/home/Hero";
import ImageDisplay from "@/components/home/ImageDisplay";
import FeaturesSection from "@/components/home/FeaturesSection";
import { generateImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();
  const { images, saveImage, deleteImage } = useImages();
  
  const { heroRef } = useGSAPAnimations();
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  
  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      // User is logged in, redirect to dashboard
      return;
    }
  }, [user]);
  
  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const demoImages = [
    { 
      id: "demo-1",
      url: "https://images.unsplash.com/photo-1655720828018-7467e7fa7c92?q=80&w=1287&auto=format&fit=crop",
      prompt: "A futuristic city with flying vehicles and neon lights" 
    },
    { 
      id: "demo-2",
      url: "https://images.unsplash.com/photo-1675254627304-5c9a37fe1838?q=80&w=1287&auto=format&fit=crop",
      prompt: "A fantasy landscape with magical creatures" 
    },
    { 
      id: "demo-3",
      url: "https://images.unsplash.com/photo-1676918555354-c2be7c7b3917?q=80&w=1287&auto=format&fit=crop",
      prompt: "An underwater scene with colorful fish and coral" 
    }
  ];
  
  // Sample gallery of demo images
  const [galleryImages, setGalleryImages] = useState(demoImages);
  
  const handleGenerateStart = () => {
    // Only allow generation if user is logged in
    if (!user) return;
    setIsGenerating(true);
  };
  
  const handleGenerateComplete = async (url: string, prompt: string) => {
    // Only proceed if user is logged in
    if (!user) return;
    
    setImageUrl(url);
    setCurrentPrompt(prompt);
    setIsGenerating(false);
    
    // Add the new image to the beginning of the gallery
    const newImage = { id: `new-${Date.now()}`, url, prompt };
    setGalleryImages([newImage, ...galleryImages.slice(0, 5)]);
    
    // If user is logged in, save the image
    if (user) {
      await saveImage(url, prompt);
    }
  };

  const handleRegenerate = (prompt: string) => {
    // Only allow regeneration if user is logged in
    if (!user) return;
    
    setCurrentPrompt(prompt);
    setIsGenerating(true);
    // This will call the actual API to generate the image
    setTimeout(async () => {
      try {
        const url = await generateImage(prompt);
        handleGenerateComplete(url, prompt);
      } catch (error) {
        console.error("Error regenerating image:", error);
        setIsGenerating(false);
      }
    }, 100);
  };

  const handleDeleteImage = async (id: string) => {
    if (!user || !id) return false;
    
    const success = await deleteImage(id);
    if (success) {
      setGalleryImages(galleryImages.filter(img => img.id !== id));
    }
    return success;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <Hero
        isGenerating={isGenerating}
        onGenerateStart={handleGenerateStart}
        onGenerateComplete={handleGenerateComplete}
      />
      
      {/* Call to Action section for non-logged in users */}
      <motion.div
        className="container max-w-7xl mx-auto px-4 py-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-main text-transparent bg-clip-text">
          Create Amazing AI Images with Gemini
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Sign in or create an account to start generating your own AI images powered by Gemini. 
          Save your creations, share them with friends, and download them for use anywhere.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button variant="default" className="gap-2 bg-gradient-main hover:opacity-90 px-6 py-6 text-lg">
              Get Started
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="px-6 py-6 text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </motion.div>
      
      {/* Demo Image Gallery */}
      <div className="container max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">Example Creations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demoImages.map((image, index) => (
            <motion.div 
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-lg overflow-hidden shadow-lg border border-border/50"
            >
              <div className="aspect-square overflow-hidden">
                <img src={image.url} alt={image.prompt} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{image.prompt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Features Section */}
      <FeaturesSection />
      
      <Footer />
    </div>
  );
};

export default Index;
