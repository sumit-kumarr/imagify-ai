
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import ImageGallery from "@/components/ImageGallery";

interface ImageDisplayProps {
  isGenerating: boolean;
  imageUrl: string | null;
  currentPrompt: string;
  galleryImages: Array<{ url: string; prompt: string; id?: string }>;
  onRegenerate: (prompt: string) => void;
  user: any;
}

const ImageDisplay = ({ 
  isGenerating, 
  imageUrl, 
  currentPrompt, 
  galleryImages, 
  onRegenerate,
  user
}: ImageDisplayProps) => {
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
        </div>
        
        <ImageGallery 
          images={galleryImages} 
          onRegenerate={onRegenerate}
        />
      </div>
    </div>
  );
};

export default ImageDisplay;
