
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateImage } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PromptInputProps {
  onGenerateStart: () => void;
  onGenerateComplete: (imageUrl: string, prompt: string) => void;
}

const PROMPT_SUGGESTIONS = [
  "A futuristic cityscape with flying vehicles and neon lights",
  "A peaceful mountain landscape at sunset with a small cabin",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater scene with vibrant coral reefs and tropical fish",
  "A steampunk-inspired mechanical dragon soaring through the clouds"
];

const PromptInput = ({ onGenerateStart, onGenerateComplete }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [detailedPrompt, setDetailedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("simple");

  const handleGenerate = async () => {
    const finalPrompt = currentTab === "simple" ? prompt : detailedPrompt;
    
    if (!finalPrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description to generate an image",
        variant: "destructive",
      });
      return;
    }

    try {
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
    } catch (error) {
      console.error("Error generating image:", error);
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
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Tabs defaultValue="simple" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="simple">Simple Prompt</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Prompt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
              disabled={isGenerating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) {
                  handleGenerate();
                }
              }}
            />
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-main hover:opacity-90"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Textarea 
            placeholder="Provide a detailed description of the image you want to create. Include specifics about style, colors, lighting, mood, subjects, and composition."
            value={detailedPrompt}
            onChange={(e) => setDetailedPrompt(e.target.value)}
            className="min-h-32 mb-3"
            disabled={isGenerating}
          />
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-main hover:opacity-90"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Detailed Image"}
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4">
        <p className="text-sm text-muted-foreground mb-2">Need inspiration? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((suggestion, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs"
            >
              {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
