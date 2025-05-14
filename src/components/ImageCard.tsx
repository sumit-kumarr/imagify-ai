
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2, RefreshCw, Copy, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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
  const [shareTab, setShareTab] = useState("link");

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
      if (navigator.share && navigator.canShare && navigator.canShare({ url: imageUrl })) {
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
  };
  
  const shareToSocialMedia = (platform: string) => {
    let shareUrl = "";
    const encodedImageUrl = encodeURIComponent(imageUrl);
    const encodedText = encodeURIComponent(`Check out this AI-generated image: "${prompt}"`);
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedImageUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedImageUrl}&quote=${encodedText}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedImageUrl}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodedImageUrl}&description=${encodedText}&media=${encodedImageUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=600');
      setShareDialogOpen(false);
      toast({
        title: `Sharing to ${platform}`,
        description: "Opening share window...",
      });
    }
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
                <Share2 size={16} />
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Image</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="link" value={shareTab} onValueChange={setShareTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">Copy Link</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Input 
                  value={imageUrl} 
                  readOnly 
                  className="flex-1"
                />
                <Button onClick={copyToClipboard} size="sm" className="flex items-center gap-1">
                  <Copy size={16} />
                  <span>Copy</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="py-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => shareToSocialMedia("twitter")}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => shareToSocialMedia("facebook")}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                  </svg>
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => shareToSocialMedia("linkedin")}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                    <path d="M6.5 21H3v-9.5h3.5V21zM4.75 10a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zM18 21h-3.5v-5.25c0-.97-.025-2.217-1.35-2.217-1.35 0-1.565 1.057-1.565 2.147V21h-3.5V11.5h3.36v1.54h.048c.348-.66 1.195-1.355 2.463-1.355 2.633 0 3.124 1.733 3.124 3.98V21z" />
                  </svg>
                  LinkedIn
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => shareToSocialMedia("pinterest")}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                  </svg>
                  Pinterest
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="sm:justify-start">
            <Button 
              variant="secondary" 
              onClick={() => setShareDialogOpen(false)}
              className="mt-2"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCard;
