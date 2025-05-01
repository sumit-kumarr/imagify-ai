
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

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

      const { data, error } = await supabase
        .from("images")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setImages(data || []);
    } catch (err: any) {
      console.error("Error fetching images:", err);
      setError(err.message || "Failed to fetch images");
      toast({
        title: "Error",
        description: "Failed to load your images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new image to the database
  const saveImage = async (url: string, prompt: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("images")
        .insert([{ url, prompt, user_id: user.id }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setImages([data[0], ...images]);
        toast({
          title: "Image saved",
          description: "Your creation has been saved to your collection",
        });
        return data[0];
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

  // Delete an image from the database
  const deleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from("images")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      setImages(images.filter((image) => image.id !== id));
      
      toast({
        title: "Image deleted",
        description: "Your image has been deleted successfully",
      });
      return true;
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
