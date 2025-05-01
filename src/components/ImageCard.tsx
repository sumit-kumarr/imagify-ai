
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface ImageCardProps {
  imageUrl: string;
  prompt: string;
  createdAt?: string;
  onRegenerate?: (prompt: string) => void;
  className?: string;
}

const ImageCard = ({ 
  imageUrl, 
  prompt, 
  createdAt, 
  onRegenerate,
  className = ""
}: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `artificialcanvas-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
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
          
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleDownload}>
              <Download size={16} />
            </Button>
            {onRegenerate && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onRegenerate(prompt)}
                className="gap-1"
              >
                <span className="hidden sm:inline">Regenerate</span>
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ImageCard;
