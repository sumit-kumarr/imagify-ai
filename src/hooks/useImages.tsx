
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [isEmpty, setIsEmpty] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  // Fetch images for the current user
  const fetchImages = useCallback(async () => {
    if (!user) {
      setImages([]);
      setIsLoading(false);
      setIsEmpty(true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsEmpty(false);

      console.log("Fetching images for user:", user.id);
      const fetchedImages = await getImagesWithFallback(user.id);
      
      console.log("Images fetched:", fetchedImages?.length || 0);
      setImages(fetchedImages || []);
      setIsEmpty(fetchedImages.length === 0);
    } catch (err: any) {
      console.error("Error fetching images:", err);
      setError(err.message || "Failed to fetch images");
      toast({
        title: "Error",
        description: "Failed to load your images. Check your connection.",
        variant: "destructive",
      });
    } finally {
      // Delay setting isLoading to false to prevent UI flashing
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [user, toast]);

  // Save a new image to the database
  const saveImage = async (url: string, prompt: string) => {
    if (!user) return null;

    try {
      console.log("Attempting to save image:", { url, prompt });
      const savedImage = await saveImageWithFallback(url, prompt, user);
      
      if (savedImage) {
        console.log("Image saved successfully:", savedImage);
        // Update local state with the new image
        setImages(prevImages => [savedImage, ...prevImages]);
        setIsEmpty(false);
        
        toast({
          title: "Image saved",
          description: "Your creation has been saved to your collection",
        });
        return savedImage;
      }
      console.log("No image data returned after save attempt");
      return null;
    } catch (err: any) {
      console.error("Error saving image:", err);
      toast({
        title: "Error",
        description: "Failed to save your image to database",
        variant: "destructive",
      });
      return null;
    }
  };

  // Delete an image
  const deleteImage = async (id: string) => {
    if (!user || !id) return false;

    try {
      console.log(`Attempting to delete image with ID: ${id}`);
      const success = await deleteImageWithFallback(id, user.id);
      
      if (success) {
        console.log("Image deleted successfully");
        // Update local state
        const updatedImages = images.filter((image) => image.id !== id);
        setImages(updatedImages);
        setIsEmpty(updatedImages.length === 0);
        
        toast({
          title: "Image deleted",
          description: "Your image has been removed from your collection",
        });
      } else {
        console.log("Failed to delete image");
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

  // Fetch images when the user changes or component mounts
  useEffect(() => {
    if (user) {
      console.log("User available, fetching images");
      fetchImages();
    } else {
      console.log("No user available, clearing images");
      setImages([]);
      setIsLoading(false);
      setIsEmpty(true);
    }
  }, [user?.id, fetchImages]);

  return {
    images,
    isLoading,
    isEmpty,
    error,
    fetchImages,
    saveImage,
    deleteImage,
  };
};
