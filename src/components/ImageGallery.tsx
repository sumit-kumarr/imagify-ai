
import { useState } from "react";
import { motion } from "framer-motion";
import ImageCard from "./ImageCard";

interface ImageGalleryProps {
  images: {
    id?: string;
    url: string;
    prompt: string;
    createdAt?: string;
  }[];
  onRegenerate?: (prompt: string) => void;
}

const ImageGallery = ({ images, onRegenerate }: ImageGalleryProps) => {
  const [visibleImages, setVisibleImages] = useState(12);

  if (!images.length) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground max-w-md"
        >
          <h3 className="text-lg font-medium mb-2">No images yet</h3>
          <p>
            Start by entering a prompt above and generating your first AI image!
          </p>
        </motion.div>
      </div>
    );
  }

  const loadMore = () => {
    setVisibleImages((prev) => prev + 12);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {images.slice(0, visibleImages).map((image, index) => (
          <ImageCard
            key={image.id || index}
            imageUrl={image.url}
            prompt={image.prompt}
            createdAt={image.createdAt}
            onRegenerate={onRegenerate}
            className="h-full"
          />
        ))}
      </motion.div>

      {visibleImages < images.length && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
