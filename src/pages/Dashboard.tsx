
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@/hooks/useAuth";
import { useImages } from "@/hooks/useImages";
import { useToast } from "@/components/ui/use-toast";
import { generateImage } from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import GenerateImageSection from "@/components/dashboard/GenerateImageSection";
import UserImagesGallery from "@/components/dashboard/UserImagesGallery";

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, isLoading: authLoading } = useUser();
  const { images, isLoading: imagesLoading, fetchImages, saveImage, deleteImage } = useImages();
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState<string>("");
  const { toast } = useToast();

  // Fetch images when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user, fetchImages]);

  // If auth is loading, show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  // If no user is logged in, redirect to the login page
  if (!user && !authLoading) {
    return <Navigate to="/login" replace />;
  }

  const handleGenerateStart = () => {
    setIsGenerating(true);
    // Reset the newly generated image
    setNewImageUrl(null);
  };

  const handleGenerateComplete = async (imageUrl: string, prompt: string) => {
    setIsGenerating(false);
    setNewImageUrl(imageUrl);
    setNewPrompt(prompt);

    // Save the new image to the database
    try {
      await saveImage(imageUrl, prompt);
      toast({
        title: "Image saved",
        description: "Your creation has been added to your collection",
      });
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  // Handle image regeneration
  const handleRegenerate = async (prompt: string) => {
    setNewPrompt(prompt);
    handleGenerateStart();
    
    try {
      const imageUrl = await generateImage(prompt);
      handleGenerateComplete(imageUrl, prompt);
    } catch (error) {
      console.error("Error regenerating image:", error);
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${prompt.substring(0, 20).replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Image downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this AI-generated image!',
          text: 'Generated with ArtificialCanvas',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Image URL copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      toast({
        title: "Error",
        description: "Failed to share image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <Navbar />

      <div className="flex-1 pt-24">
        {/* Header section */}
        <DashboardHeader />

        {/* Main content */}
        <main className="container max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Create new image section */}
          <GenerateImageSection
            onGenerateStart={handleGenerateStart}
            onGenerateComplete={handleGenerateComplete}
            isGenerating={isGenerating}
            newImageUrl={newImageUrl}
            newPrompt={newPrompt}
            handleDownload={handleDownload}
            handleShare={handleShare}
            handleRegenerate={handleRegenerate}
          />

          {/* Images gallery section */}
          <UserImagesGallery
            images={images}
            imagesLoading={imagesLoading}
            onRegenerate={handleRegenerate}
            onDelete={deleteImage}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
