
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromptInput from "@/components/PromptInput";
import ImageGallery from "@/components/ImageGallery";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@/hooks/useAuth";
import { useImages, Image } from "@/hooks/useImages";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, isLoading: authLoading } = useUser();
  const { images, isLoading: imagesLoading, fetchImages, saveImage, deleteImage } = useImages();
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState<string>("");
  const { toast } = useToast();

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
  const handleRegenerate = (prompt: string) => {
    setNewPrompt(prompt);
    handleGenerateStart();
    // This would normally call the API with the prompt
    // For demo purposes, we'll simulate a delay then show a "regenerated" image
    setTimeout(() => {
      handleGenerateComplete(`https://picsum.photos/seed/${Date.now()}/800/800`, prompt);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header section */}
        <header className="bg-muted py-16 px-4">
          <div className="container max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome to your Dashboard, {user?.user_metadata?.username || user?.email?.split("@")[0]}
              </h1>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Here you can create new AI-generated images, view your past creations,
                and manage your account.
              </p>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="container max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Create new image section */}
          <section>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-semibold mb-6"
            >
              Create New Image
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
                <LoadingSpinner />
              </div>
            ) : (
              newImageUrl && (
                <motion.div 
                  className="mt-10 bg-card rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={newImageUrl}
                    alt={newPrompt}
                    className="w-full h-auto"
                  />
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

            <Tabs defaultValue="all" className="w-full">
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
                ) : images.length > 0 ? (
                  <ImageGallery images={images} onRegenerate={handleRegenerate} />
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">You haven't created any images yet.</p>
                    <p className="mt-2">Start by entering a prompt above!</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="space-y-4">
                <ImageGallery
                  images={[...images].sort((a, b) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  ).slice(0, 8)}
                  onRegenerate={handleRegenerate}
                />
              </TabsContent>
              
              <TabsContent value="oldest" className="space-y-4">
                <ImageGallery
                  images={[...images].sort((a, b) => 
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                  ).slice(0, 8)}
                  onRegenerate={handleRegenerate}
                />
              </TabsContent>
            </Tabs>
            
            {images.length > 12 && (
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
