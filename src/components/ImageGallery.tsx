
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Share2, Trash2, Image as ImageIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Image {
  id?: string;
  url: string;
  prompt: string;
  created_at?: string;
}

interface ImageGalleryProps {
  images: Image[];
  onRegenerate: (prompt: string) => void;
  onDelete?: (id: string) => Promise<boolean>;
  onDownload?: (url: string, prompt: string) => void;
  onShare?: (url: string) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
}

const ImageGallery = ({ 
  images, 
  onRegenerate, 
  onDelete,
  onDownload,
  onShare,
  isLoading = false,
  isEmpty = false
}: ImageGalleryProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  // Loading state UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow-md border border-border/50">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state UI  
  if (isEmpty || !images || images.length === 0) {
    return (
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
          <Button
            onClick={() => document.querySelector('input')?.focus()}
            variant="outline"
            className="bg-background"
          >
            Create Your First Image
          </Button>
        </div>
      </motion.div>
    );
  }

  // Handlers
  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId || !onDelete) return;
    
    await onDelete(deletingId);
    setDeletingId(null);
  };

  const handleImageLoad = (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const imageId = image.id || `img-${index}`;
          const isLoading = loadingStates[imageId] !== false;
          
          return (
            <motion.div 
              key={imageId}
              className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(imageId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="aspect-square overflow-hidden bg-muted relative group">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/20">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
                
                <img 
                  src={image.url} 
                  alt={image.prompt}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLoading ? 'opacity-40' : 'opacity-100'}`}
                  onLoad={() => handleImageLoad(imageId)}
                  onError={() => handleImageLoad(imageId)}
                />
                
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
                  {onDownload && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onDownload(image.url, image.prompt)}
                      className="bg-background/20 hover:bg-background/40 backdrop-blur-sm"
                    >
                      <Download size={18} />
                    </Button>
                  )}
                  
                  {onShare && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onShare(image.url)}
                      className="bg-background/20 hover:bg-background/40 backdrop-blur-sm"
                    >
                      <Share2 size={18} />
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onRegenerate(image.prompt)} 
                    className="bg-background/20 hover:bg-background/40 backdrop-blur-sm"
                  >
                    <RefreshCw size={18} />
                  </Button>
                  
                  {onDelete && image.id && !image.id.startsWith('demo-') && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteClick(image.id!)}
                      className="bg-background/20 hover:bg-background/40 text-destructive hover:text-destructive backdrop-blur-sm"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{image.prompt}</p>
                
                <div className="flex justify-between items-center">
                  {image.created_at && (
                    <Badge variant="outline" className="text-xs">
                      {formatDate(image.created_at)}
                    </Badge>
                  )}
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRegenerate(image.prompt)} 
                      className="text-xs"
                    >
                      <RefreshCw size={14} className="mr-1" /> Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this image from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImageGallery;
