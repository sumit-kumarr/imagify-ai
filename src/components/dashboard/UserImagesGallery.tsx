
import { motion } from "framer-motion";
import ImageGallery from "@/components/ImageGallery";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from "@/hooks/useImages";
import { useState } from "react";

interface UserImagesGalleryProps {
  images: Image[];
  imagesLoading: boolean;
  onRegenerate: (prompt: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onDownload: (url: string, prompt: string) => void;
  onShare: (url: string) => void;
}

const UserImagesGallery = ({
  images,
  imagesLoading,
  onRegenerate,
  onDelete,
  onDownload,
  onShare
}: UserImagesGalleryProps) => {
  const [activeTab, setActiveTab] = useState("all");

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
              onRegenerate={onRegenerate} 
              onDelete={onDelete}
              onDownload={onDownload}
              onShare={onShare}
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
              onRegenerate={onRegenerate}
              onDelete={onDelete}
              onDownload={onDownload}
              onShare={onShare}
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
              onRegenerate={onRegenerate}
              onDelete={onDelete}
              onDownload={onDownload}
              onShare={onShare}
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
  );
};

export default UserImagesGallery;
