
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Share2, Trash2 } from "lucide-react";
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

interface Image {
  id?: string;
  url: string;
  prompt: string;
}

interface ImageGalleryProps {
  images: Image[];
  onRegenerate: (prompt: string) => void;
  onDelete?: (id: string) => Promise<boolean>;
  onDownload?: (url: string, prompt: string) => void;
  onShare?: (url: string) => void;
}

const ImageGallery = ({ 
  images, 
  onRegenerate, 
  onDelete,
  onDownload,
  onShare
}: ImageGalleryProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No images to display</p>
      </div>
    );
  }

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId || !onDelete) return;
    
    await onDelete(deletingId);
    setDeletingId(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div 
            key={image.id || index}
            className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <img 
                src={image.url} 
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{image.prompt}</p>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRegenerate(image.prompt)} 
                  className="text-xs"
                >
                  <RefreshCw size={14} className="mr-1" /> Regenerate
                </Button>
                
                <div className="flex gap-1">
                  {onDownload && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDownload(image.url, image.prompt)}
                    >
                      <Download size={14} />
                    </Button>
                  )}
                  
                  {onShare && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onShare(image.url)}
                    >
                      <Share2 size={14} />
                    </Button>
                  )}
                  
                  {onDelete && image.id && !image.id.startsWith('demo-') && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteClick(image.id!)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImageGallery;
