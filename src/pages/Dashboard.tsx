
import { useState, useEffect, useCallback } from "react";
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
  const { 
    images, 
    isLoading: imagesLoading, 
    fetchImages, 
    saveImage, 
    deleteImage 
  } = useImages();
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState<string>("");
  const { toast } = useToast();

  // Refresh images manually when needed
  const handleRefreshImages = useCallback(() => {
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
    setNewPrompt("");
  };

  const handleGenerateComplete = async (imageUrl: string, prompt: string) => {
    setIsGenerating(false);
    setNewImageUrl(imageUrl);
    setNewPrompt(prompt);

    // Save the new image to the database
    try {
      await saveImage(imageUrl, prompt);
      // Refresh images to include the newly saved one
      handleRefreshImages();
    } catch (error) {
      console.error("Error saving image:", error);
      toast({
        title: "Note",
        description: "Image was generated but couldn't be saved to your collection",
        variant: "default",
      });
    }
  };

  // Handle image regeneration
  const handleRegenerate = async (prompt: string) => {
    setNewPrompt(prompt);
    handleGenerateStart();
    
    try {
      console.log("Regenerating with prompt:", prompt);
      const imageUrl = await generateImage(prompt);
      console.log("Generated image URL:", imageUrl);
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
      // Check if the Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this AI-generated image!',
          text: 'Generated with ArtificialCanvas',
          url: url,
        });
        toast({
          title: "Shared",
          description: "Image shared successfully",
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Image URL copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      // Don't show error toast for user cancellations
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Error",
          description: "Failed to share image. Link copied to clipboard instead.",
          variant: "destructive",
        });
        // Try to copy to clipboard as fallback
        try {
          await navigator.clipboard.writeText(url);
        } catch (clipboardError) {
          console.error("Clipboard fallback failed:", clipboardError);
        }
      }
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
            onRefresh={handleRefreshImages}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
