
import { motion } from "framer-motion";
import ImageGallery from "@/components/ImageGallery";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from "@/hooks/useImages";
import { useState, useEffect } from "react";
import { ImageIcon, RefreshCw } from "lucide-react";

interface UserImagesGalleryProps {
  images: Image[];
  imagesLoading: boolean;
  onRegenerate: (prompt: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onDownload: (url: string, prompt: string) => void;
  onShare: (url: string) => void;
  onRefresh?: () => void;
}

const UserImagesGallery = ({
  images,
  imagesLoading,
  onRegenerate,
  onDelete,
  onDownload,
  onShare,
  onRefresh
}: UserImagesGalleryProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(true);
  
  // Set initial load complete after a delay to prevent flickering
  useEffect(() => {
    if (!imagesLoading) {
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 500);
      
      // Also set loading timeout to false after 5 seconds
      // This prevents infinite loading states
      const loadingTimer = setTimeout(() => {
        setLoadingTimeout(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(loadingTimer);
      };
    }
  }, [imagesLoading]);

  // Filter images when active tab changes or images update
  useEffect(() => {
    setVisibleImages(getFilteredImages());
  }, [activeTab, images]);
  
  // Get filtered images based on active tab
  const getFilteredImages = () => {
    if (!images?.length) return [];
    
    switch (activeTab) {
      case "recent":
        return [...images].sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ).slice(0, 12);
      case "oldest":
        return [...images].sort((a, b) => 
          new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        ).slice(0, 12);
      default:
        return images.slice(0, 24);
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    if (onRefresh) {
      setInitialLoadComplete(false);
      setLoadingTimeout(true);
      onRefresh();
      
      // Reset timeout
      setTimeout(() => {
        setLoadingTimeout(false);
      }, 5000);
    }
  };

  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-card rounded-xl border border-border/10"
    >
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 p-4 rounded-full mb-3">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium text-lg mb-2">No images found</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Start creating beautiful AI-generated images by entering a prompt above.
        </p>
        {onRefresh && (
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="bg-background"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Gallery
          </Button>
        )}
      </div>
    </motion.div>
  );

  const LoadingState = () => (
    <div className="py-12 min-h-[400px] flex flex-col items-center justify-center">
      <LoadingSpinner text="Loading your images..." size={80} />
      
      {!loadingTimeout ? (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Taking longer than expected? Try refreshing.
          </p>
          <Button variant="outline" onClick={handleRefresh} className="mx-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Images
          </Button>
        </div>
      ) : null}
    </div>
  );

  return (
    <section className="mt-16">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-2xl font-semibold mb-6 flex items-center justify-between"
      >
        <span>Your Creations</span>
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={imagesLoading}
            className="text-muted-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        )}
      </motion.h2>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Images</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="oldest">Oldest</TabsTrigger>
        </TabsList>
        
        <div className="min-h-[400px]">
          {(imagesLoading && !initialLoadComplete) || (loadingTimeout && imagesLoading) ? (
            <LoadingState />
          ) : (
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              {visibleImages && visibleImages.length > 0 ? (
                <ImageGallery 
                  images={visibleImages} 
                  onRegenerate={onRegenerate} 
                  onDelete={onDelete}
                  onDownload={onDownload}
                  onShare={onShare}
                />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
          )}
        </div>
        
        {images && images.length > 24 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        )}
      </Tabs>
    </section>
  );
};

export default UserImagesGallery;
