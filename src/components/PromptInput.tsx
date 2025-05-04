
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateImage } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Wand2, Sparkles, Image, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PromptInputProps {
  onGenerateStart: () => void;
  onGenerateComplete: (imageUrl: string, prompt: string) => void;
}

const PROMPT_SUGGESTIONS = [
  "A futuristic cityscape with flying vehicles and neon lights",
  "A peaceful mountain landscape at sunset with a small cabin",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater scene with vibrant coral reefs and tropical fish",
  "A steampunk-inspired mechanical dragon soaring through the clouds",
  "A cozy cafe interior with rain falling outside the windows",
  "An ancient temple hidden in a jungle with mystical symbols",
  "A spacecraft approaching an alien planet with multiple moons"
];

const STYLE_MODIFIERS = [
  "in the style of Van Gogh",
  "as a watercolor painting",
  "with neon colors",
  "with a cinematic look",
  "with a minimalist design",
  "as pixel art",
  "as an oil painting",
  "in anime style"
];

const PromptInput = ({ onGenerateStart, onGenerateComplete }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [detailedPrompt, setDetailedPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("simple");

  const handleGenerate = async () => {
    const finalPrompt = currentTab === "simple" 
      ? prompt + (selectedStyle ? ` ${selectedStyle}` : "") 
      : detailedPrompt;
    
    if (!finalPrompt.trim()) {
      setError("Please enter a description to generate an image");
      return;
    }

    try {
      setError(null);
      setIsGenerating(true);
      onGenerateStart();
      
      console.log("Sending prompt to generate image:", finalPrompt);
      const imageUrl = await generateImage(finalPrompt);
      console.log("Received image URL:", imageUrl);
      
      onGenerateComplete(imageUrl, finalPrompt);
      toast({
        title: "Image generated!",
        description: "Your AI artwork has been created successfully",
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      setError(error?.message || "Failed to generate image");
      toast({
        title: "Generation failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (currentTab === "simple") {
      setPrompt(suggestion);
    } else {
      setDetailedPrompt(suggestion);
    }
    setError(null);
  };

  const handleStyleClick = (style: string) => {
    setSelectedStyle(selectedStyle === style ? null : style);
  };

  const handleClear = () => {
    if (currentTab === "simple") {
      setPrompt("");
    } else {
      setDetailedPrompt("");
    }
    setSelectedStyle(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Tabs defaultValue="simple" className="w-full" onValueChange={(value) => {
        setCurrentTab(value);
        setError(null);
      }}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="simple">Simple Prompt</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Prompt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Describe what you want to create..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError(null);
                }}
                className="flex-1"
                disabled={isGenerating}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
                    handleGenerate();
                  }
                }}
              />
              <div className="flex gap-2">
                {prompt && (
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    disabled={isGenerating}
                    className="whitespace-nowrap"
                  >
                    Clear
                  </Button>
                )}
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-main hover:opacity-90 whitespace-nowrap"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Image"}
                </Button>
              </div>
            </div>
            
            {selectedStyle && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center"
              >
                <span className="text-sm text-muted-foreground mr-2">Style:</span>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer" onClick={() => setSelectedStyle(null)}>
                  {selectedStyle} ✕
                </Badge>
              </motion.div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="space-y-4">
            <Textarea 
              placeholder="Provide a detailed description of the image you want to create. Include specifics about style, colors, lighting, mood, subjects, and composition."
              value={detailedPrompt}
              onChange={(e) => {
                setDetailedPrompt(e.target.value);
                setError(null);
              }}
              className="min-h-32 mb-3"
              disabled={isGenerating}
            />
            <div className="flex gap-2 justify-end">
              {detailedPrompt && (
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  disabled={isGenerating}
                >
                  Clear
                </Button>
              )}
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-main hover:opacity-90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Detailed Image"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      <div className="pt-6 border-t border-border/30">
        <div className="flex items-center mb-3">
          <Lightbulb className="h-4 w-4 mr-2 text-primary" />
          <p className="text-sm font-medium">Prompt ideas:</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {PROMPT_SUGGESTIONS.map((suggestion, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-background/50 border-border/50"
              >
                {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
              </Button>
            </motion.div>
          ))}
        </div>
        
        {currentTab === "simple" && (
          <div>
            <div className="flex items-center mb-3">
              <Image className="h-4 w-4 mr-2 text-primary" />
              <p className="text-sm font-medium">Style modifiers:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {STYLE_MODIFIERS.map((style, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant={selectedStyle === style ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => handleStyleClick(style)}
                    className={`text-xs ${selectedStyle === style ? 'bg-secondary/80' : 'bg-background/50 border-border/50'}`}
                  >
                    {style}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptInput;
