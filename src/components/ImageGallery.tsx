
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
import { Badge } from "@/components/ui/badge";

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
}

const ImageGallery = ({ 
  images, 
  onRegenerate, 
  onDelete,
  onDownload,
  onShare
}: ImageGalleryProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div 
            key={image.id || index}
            className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredId(image.id || null)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="aspect-square overflow-hidden bg-muted relative group">
              <img 
                src={image.url} 
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-200">
                {onDownload && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onDownload(image.url, image.prompt)}
                    className="bg-background/20 hover:bg-background/40"
                  >
                    <Download size={20} />
                  </Button>
                )}
                
                {onShare && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onShare(image.url)}
                    className="bg-background/20 hover:bg-background/40"
                  >
                    <Share2 size={20} />
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onRegenerate(image.prompt)} 
                  className="bg-background/20 hover:bg-background/40"
                >
                  <RefreshCw size={20} />
                </Button>
                
                {onDelete && image.id && !image.id.startsWith('demo-') && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDeleteClick(image.id!)}
                    className="bg-background/20 hover:bg-background/40 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={20} />
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
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImageGallery;
