
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import ImageGallery from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface ImageDisplayProps {
  isGenerating: boolean;
  imageUrl: string | null;
  currentPrompt: string;
  galleryImages: Array<{ url: string; prompt: string; id?: string }>;
  onRegenerate: (prompt: string) => void;
  user: any;
  onDeleteImage?: (id: string) => Promise<boolean>;
}

const ImageDisplay = ({ 
  isGenerating, 
  imageUrl, 
  currentPrompt, 
  galleryImages, 
  onRegenerate,
  user,
  onDeleteImage
}: ImageDisplayProps) => {
  const { toast } = useToast();

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
          text: 'Generated with AI Image Generator',
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

  if (!user) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Create Amazing AI Images</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign in or create an account to start generating your own AI images. 
            Save your creations, share them with friends, and download them for use anywhere.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button variant="default" className="gap-2 bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
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
            initial={{ opacity: 0, y: a20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Your Creation</h2>
            <div className="max-w-3xl mx-auto bg-card rounded-lg overflow-hidden shadow-lg">
              <img src={imageUrl} alt={currentPrompt} className="w-full h-auto" />
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3">{currentPrompt}</p>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownload(imageUrl, currentPrompt)}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare(imageUrl)}
                  >
                    <Share2 size={16} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )
      )}
      
      {/* Gallery section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Creations</h2>
        </div>
        
        <ImageGallery 
          images={galleryImages} 
          onRegenerate={onRegenerate}
          onDelete={onDeleteImage}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

export default ImageDisplay;
