
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { getImagesWithFallback, saveImageWithFallback, deleteImageWithFallback } from "@/lib/api";

export interface Image {
  id: string;
  url: string;
  prompt: string;
  user_id: string;
  created_at: string;
}

export const useImages = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();

  // Fetch images for the current user
  const fetchImages = async () => {
    if (!user) {
      setImages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const fetchedImages = await getImagesWithFallback(user.id);
      setImages(fetchedImages || []);
    } catch (err: any) {
      console.error("Error fetching images:", err);
      setError(err.message || "Failed to fetch images");
      toast({
        title: "Error",
        description: "Failed to load your images. Using local storage as fallback.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new image to the database with fallback mechanism
  const saveImage = async (url: string, prompt: string) => {
    if (!user) return null;

    try {
      const savedImage = await saveImageWithFallback(url, prompt, user);
      
      if (savedImage) {
        setImages([savedImage, ...images]);
        toast({
          title: "Image saved",
          description: "Your creation has been saved to your collection",
        });
        return savedImage;
      }
      return null;
    } catch (err: any) {
      console.error("Error saving image:", err);
      toast({
        title: "Error",
        description: "Failed to save your image",
        variant: "destructive",
      });
      return null;
    }
  };

  // Delete an image with fallback mechanism
  const deleteImage = async (id: string) => {
    if (!user || !id) return false;

    try {
      const success = await deleteImageWithFallback(id, user.id);
      
      if (success) {
        setImages(images.filter((image) => image.id !== id));
        
        toast({
          title: "Image deleted",
          description: "Your image has been deleted successfully",
        });
      }
      return success;
    } catch (err: any) {
      console.error("Error deleting image:", err);
      toast({
        title: "Error",
        description: "Failed to delete the image",
        variant: "destructive",
      });
      return false;
    }
  };

  // Fetch images when the user changes
  useEffect(() => {
    fetchImages();
  }, [user?.id]);

  return {
    images,
    isLoading,
    error,
    fetchImages,
    saveImage,
    deleteImage,
  };
};
