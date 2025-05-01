
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share, Trash2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImageCardProps {
  imageUrl: string;
  prompt: string;
  createdAt?: string;
  onRegenerate?: (prompt: string) => void;
  onDelete?: (id: string) => void;
  id?: string;
  className?: string;
}

const ImageCard = ({ 
  imageUrl, 
  prompt, 
  createdAt, 
  onRegenerate,
  onDelete,
  id,
  className = ""
}: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `artificialcanvas-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Image downloaded",
      description: "Your image has been downloaded successfully",
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AI Generated Image',
          text: prompt,
          url: imageUrl,
        });
        toast({
          title: "Shared successfully",
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        setShareDialogOpen(true);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setShareDialogOpen(true);
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl);
    toast({
      title: "Link copied",
      description: "Image URL copied to clipboard",
    });
    setShareDialogOpen(false);
  };

  const handleDelete = () => {
    if (onDelete && id) {
      onDelete(id);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`h-full ${className}`}
      >
        <Card className="overflow-hidden h-full flex flex-col">
          <CardContent className="p-0 flex-1 relative">
            <div 
              className="relative aspect-square w-full overflow-hidden bg-muted"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
              <img 
                src={imageUrl} 
                alt={prompt}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                onLoad={() => setIsLoading(false)}
              />
              
              {isHovered && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm md:text-base p-4 text-center max-w-md">
                    {prompt}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between items-center p-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium line-clamp-1 max-w-[180px]">
                {prompt.length > 30 ? `${prompt.substring(0, 30)}...` : prompt}
              </p>
              {createdAt && (
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                </p>
              )}
            </div>
            
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleDownload} title="Download">
                <Download size={16} />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleShare} disabled={isSharing} title="Share">
                <Share size={16} />
              </Button>
              {onRegenerate && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onRegenerate(prompt)}
                  title="Regenerate"
                >
                  <RefreshCw size={16} />
                </Button>
              )}
              {onDelete && id && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100/10"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={imageUrl} 
                readOnly 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCard;
