
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateImage } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface PromptInputProps {
  onGenerateStart: () => void;
  onGenerateComplete: (imageUrl: string, prompt: string) => void;
}

const PromptInput = ({ onGenerateStart, onGenerateComplete }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
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
      
      const imageUrl = await generateImage(prompt);
      
      onGenerateComplete(imageUrl, prompt);
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

  return (
    <div className="w-full max-w-3xl mx-auto">
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
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;
