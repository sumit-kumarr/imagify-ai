
import { useState, useRef, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/hooks/useAuth";
import { useImages } from "@/hooks/useImages";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import Hero from "@/components/home/Hero";
import ImageDisplay from "@/components/home/ImageDisplay";
import FeaturesSection from "@/components/home/FeaturesSection";

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
  
  useEffect(() => {
    // If user is logged in, use their images instead of demo images
    if (user && images.length > 0) {
      setGalleryImages(images);
    }
  }, [user, images]);
  
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
      
      {/* Main content with image display */}
      <ImageDisplay
        isGenerating={isGenerating}
        imageUrl={imageUrl}
        currentPrompt={currentPrompt}
        galleryImages={galleryImages}
        onRegenerate={handleRegenerate}
        user={user}
        onDeleteImage={handleDeleteImage}
      />
      
      {/* Features Section */}
      <FeaturesSection />
      
      <Footer />
    </div>
  );
};

export default Index;
