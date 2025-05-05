
import { supabase } from "@/integrations/supabase/client";

// Demo images for when no user images exist or API fails
const DEMO_IMAGES = [
  {
    id: 'demo-1',
    url: 'https://picsum.photos/seed/ai-art-1/800/800',
    prompt: 'A futuristic cityscape with flying vehicles and neon lights',
    user_id: 'demo',
    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'demo-2',
    url: 'https://picsum.photos/seed/ai-art-2/800/800',
    prompt: 'A peaceful mountain landscape at sunset with a small cabin',
    user_id: 'demo',
    created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: 'demo-3',
    url: 'https://picsum.photos/seed/ai-art-3/800/800',
    prompt: 'A magical forest with glowing plants and mythical creatures',
    user_id: 'demo',
    created_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
  }
];

// Generate image using Gemini API
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    console.log("Generating image with prompt:", prompt);
    
    // Create a consistent seed based on the prompt to get more predictable images
    const seed = encodeURIComponent(prompt.replace(/\s+/g, '-').substring(0, 30));
    const timestamp = Date.now();
    
    // Using picsum.photos for demo images
    // In production, replace this with actual image generation API call
    let imageUrl = `https://picsum.photos/seed/${timestamp}-${seed}/800/800`;
    
    // Add a small delay to simulate processing time (500ms to 2s)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
    
    console.log("Generated image URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// Function to save image to Supabase database
export const saveImageWithFallback = async (url: string, prompt: string, user: any) => {
  try {
    if (!user) {
      console.log("No user found, cannot save image");
      return null;
    }

    console.log("Saving image to Supabase:", { url, prompt, userId: user.id });
    
    // Insert the image into the Supabase database
    const { data, error } = await supabase
      .from("images")
      .insert([{ 
        url, 
        prompt, 
        user_id: user.id 
      }])
      .select();

    if (error) {
      console.error("Error saving to Supabase:", error);
      throw error;
    }
    
    console.log("Image saved successfully:", data);
    return data && data[0] ? data[0] : null;
  } catch (err) {
    console.error("Error saving image:", err);
    throw err;
  }
};

// Function to get images from Supabase
export const getImagesWithFallback = async (userId: string) => {
  try {
    if (!userId) {
      console.log("No user ID provided, returning demo images");
      return DEMO_IMAGES;
    }
    
    console.log("Fetching images for user:", userId);
    
    // Fetch images from Supabase
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching from Supabase:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`Retrieved ${data.length} images from Supabase`);
      return data;
    }
    
    // No images found in database, use demo images
    console.log("No images found for user, using demo images");
    return DEMO_IMAGES;
  } catch (error) {
    console.error("Error getting images:", error);
    return DEMO_IMAGES;
  }
};

// Function to delete image from Supabase
export const deleteImageWithFallback = async (id: string, userId: string) => {
  try {
    if (!userId || !id) return false;
    
    // If id starts with demo-, it's a demo image which we pretend to delete
    if (id.startsWith('demo-')) {
      return true;
    }
    
    console.log(`Deleting image with ID: ${id} for user: ${userId}`);
    
    // Delete the image from Supabase
    const { error } = await supabase
      .from("images")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
      
    if (error) {
      console.error("Error deleting from Supabase:", error);
      throw error;
    }
    
    console.log("Image deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// Function to share image
export const shareImage = async (url: string): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Check out this AI-generated image!',
        text: 'Generated with ArtificialCanvas',
        url: url,
      });
      return true;
    } else {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (error) {
    console.error("Error sharing image:", error);
    throw error;
  }
};

// Function to get image statistics
export const getImageStats = async (userId: string) => {
  try {
    if (!userId) {
      return {
        totalImages: 0,
        mostRecentImage: null,
      };
    }
    
    // Get statistics from Supabase
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error getting image stats:", error);
      throw error;
    }
    
    // Calculate stats
    const totalImages = data ? data.length : 0;
    const mostRecentImage = data && data.length > 0 ? data[0] : null;
    
    return {
      totalImages,
      mostRecentImage,
    };
  } catch (error) {
    console.error("Error getting image stats:", error);
    return {
      totalImages: 0,
      mostRecentImage: null,
    };
  }
};
