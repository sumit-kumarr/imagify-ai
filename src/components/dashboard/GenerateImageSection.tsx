
import { useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import PromptInput from "@/components/PromptInput";
import { Button } from "@/components/ui/button";
import { Download, Share2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GenerateImageSectionProps {
  onGenerateStart: () => void;
  onGenerateComplete: (imageUrl: string, prompt: string) => void;
  isGenerating: boolean;
  newImageUrl: string | null;
  newPrompt: string;
  handleDownload: (url: string, prompt: string) => void;
  handleShare: (url: string) => void;
  handleRegenerate: (prompt: string) => void;
}

const GenerateImageSection = ({
  onGenerateStart,
  onGenerateComplete,
  isGenerating,
  newImageUrl,
  newPrompt,
  handleDownload,
  handleShare,
  handleRegenerate
}: GenerateImageSectionProps) => {
  return (
    <section className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-semibold mb-6"
      >
        Create New Image with AI
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <PromptInput 
          onGenerateStart={onGenerateStart}
          onGenerateComplete={onGenerateComplete}
        />
      </motion.div>

      {/* Display loading spinner or newly generated image */}
      {isGenerating ? (
        <div className="mt-10">
          <LoadingSpinner text="Generating your masterpiece..." />
        </div>
      ) : (
        newImageUrl && (
          <motion.div 
            className="mt-10 bg-card rounded-lg shadow-md overflow-hidden border border-border/50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative group">
              <img 
                src={newImageUrl}
                alt={newPrompt}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-200">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDownload(newImageUrl, newPrompt)}
                  className="bg-background/20 hover:bg-background/40"
                >
                  <Download size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleShare(newImageUrl)}
                  className="bg-background/20 hover:bg-background/40"
                >
                  <Share2 size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRegenerate(newPrompt)}
                  className="bg-background/20 hover:bg-background/40"
                >
                  <RefreshCw size={20} />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">{newPrompt}</p>
            </div>
          </motion.div>
        )
      )}
    </section>
  );
};

export default GenerateImageSection;
