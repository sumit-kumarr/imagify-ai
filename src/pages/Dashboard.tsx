
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromptInput from "@/components/PromptInput";
import ImageGallery from "@/components/ImageGallery";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@/hooks/useAuth";
import { useImages } from "@/hooks/useImages";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Download, Share2, RefreshCw } from "lucide-react";
import { generateImage } from "@/lib/api";

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, isLoading: authLoading } = useUser();
  const { images, isLoading: imagesLoading, fetchImages, saveImage, deleteImage } = useImages();
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState<string>("");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

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

  // Get filtered images based on active tab
  const getFilteredImages = () => {
    if (!images?.length) return [];
    
    switch (activeTab) {
      case "recent":
        return [...images].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 12);
      case "oldest":
        return [...images].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ).slice(0, 12);
      default:
        return images.slice(0, 24);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <Navbar />

      <div className="flex-1 pt-24">
        {/* Header section */}
        <header className="bg-muted/50 py-16 px-4">
          <div className="container max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-main text-transparent bg-clip-text">
                Welcome to your Dashboard, {user?.user_metadata?.username || user?.email?.split("@")[0]}
              </h1>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Here you can create new AI-generated images, view your past creations,
                and manage your image collection.
              </p>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="container max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Create new image section */}
          <section className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-semibold mb-6"
            >
              Create New Image with AI
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <PromptInput 
                onGenerateStart={handleGenerateStart}
                onGenerateComplete={handleGenerateComplete}
              />
            </motion.div>

            {/* Display loading spinner or newly generated image */}
            {isGenerating ? (
              <div className="mt-10">
                <LoadingSpinner text="Generating your masterpiece..." />
              </div>
            ) : (
              newImageUrl && (
                <motion.div 
                  className="mt-10 bg-card rounded-lg shadow-md overflow-hidden border border-border/50"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative group">
                    <img 
                      src={newImageUrl}
                      alt={newPrompt}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-200">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDownload(newImageUrl, newPrompt)}
                        className="bg-background/20 hover:bg-background/40"
                      >
                        <Download size={20} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleShare(newImageUrl)}
                        className="bg-background/20 hover:bg-background/40"
                      >
                        <Share2 size={20} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRegenerate(newPrompt)}
                        className="bg-background/20 hover:bg-background/40"
                      >
                        <RefreshCw size={20} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{newPrompt}</p>
                  </div>
                </motion.div>
              )
            )}
          </section>

          {/* Images gallery section */}
          <section className="mt-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-semibold mb-6"
            >
              Your Creations
            </motion.h2>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="all">All Images</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="oldest">Oldest</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {imagesLoading ? (
                  <div className="py-12">
                    <LoadingSpinner text="Loading your images..." />
                  </div>
                ) : images && images.length > 0 ? (
                  <ImageGallery 
                    images={getFilteredImages()} 
                    onRegenerate={handleRegenerate} 
                    onDelete={deleteImage}
                    onDownload={handleDownload}
                    onShare={handleShare}
                  />
                ) : (
                  <div className="text-center py-16 bg-card rounded-xl border border-border/50">
                    <p className="text-muted-foreground">You haven't created any images yet.</p>
                    <p className="mt-2">Start by entering a prompt above!</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="space-y-4">
                {imagesLoading ? (
                  <div className="py-12">
                    <LoadingSpinner text="Loading your images..." />
                  </div>
                ) : (
                  <ImageGallery
                    images={getFilteredImages()}
                    onRegenerate={handleRegenerate}
                    onDelete={deleteImage}
                    onDownload={handleDownload}
                    onShare={handleShare}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="oldest" className="space-y-4">
                {imagesLoading ? (
                  <div className="py-12">
                    <LoadingSpinner text="Loading your images..." />
                  </div>
                ) : (
                  <ImageGallery
                    images={getFilteredImages()}
                    onRegenerate={handleRegenerate}
                    onDelete={deleteImage}
                    onDownload={handleDownload}
                    onShare={handleShare}
                  />
                )}
              </TabsContent>
            </Tabs>
            
            {images && images.length > 24 && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
