import { supabase } from "./supabase";

// Generate image using Gemini API
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    console.log("Generating image with prompt:", prompt);
    const API_KEY = "AIzaSyDC_T756pM450zJ4OaqhYimqfwlJivdtgw";
    
    // For demonstration, we're using a placeholder image service
    // This is because Gemini doesn't directly generate images through its API
    // In a production app, you would integrate with a proper image generation API
    
    // Create a consistent seed based on the prompt to get more predictable images
    const seed = encodeURIComponent(prompt.replace(/\s+/g, '-').substring(0, 30));
    const timestamp = Date.now();
    
    // Using picsum.photos for demo images
    // In production, replace this with actual image generation API call
    const imageUrl = `https://picsum.photos/seed/${timestamp}-${seed}/800/600`;
    
    // Add a small delay to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log("Generated image URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// Local storage for images when database is not available
let localImageStorage: any[] = [];

// Function to save image with database fallback
export const saveImageWithFallback = async (url: string, prompt: string, user: any) => {
  try {
    const imageData = {
      id: `local-${Date.now()}`,
      url,
      prompt,
      user_id: user?.id || 'anonymous',
      created_at: new Date().toISOString()
    };

    // Try to save to Supabase first if user exists
    if (user) {
      try {
        // Check if the images table exists
        const { data: tablesExist, error: checkError } = await supabase
          .from('images')
          .select('id')
          .limit(1);
        
        if (checkError && checkError.code === '42P01') {
          // Table doesn't exist, use local storage
          console.log("Images table doesn't exist, using local storage instead");
          localImageStorage.unshift(imageData);
          return imageData;
        }
        
        // If we get here, table exists
        const { data, error } = await supabase
          .from('images')
          .insert([{ url, prompt, user_id: user.id }])
          .select();

        if (error) throw error;
        return data && data[0] ? data[0] : imageData;
      } catch (dbError) {
        console.error("Database error, falling back to local storage:", dbError);
        localImageStorage.unshift(imageData);
        return imageData;
      }
    } else {
      // No user, so use local storage
      localImageStorage.unshift(imageData);
      return imageData;
    }
  } catch (err) {
    console.error("Error saving image:", err);
    throw err;
  }
};

// Function to get images with fallback
export const getImagesWithFallback = async (userId: string) => {
  try {
    // Try with Supabase first
    try {
      const { data, error } = await supabase
        .from("images")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      // Fall back to local storage
      console.log("Error getting images from database, using local storage:", error);
      return localImageStorage.filter(img => img.user_id === userId);
    }
  } catch (error) {
    console.error("Error getting images:", error);
    return [];
  }
};

// Function to delete image with fallback
export const deleteImageWithFallback = async (id: string, userId: string) => {
  try {
    // If id starts with local-, it's from local storage
    if (id.startsWith('local-')) {
      const initialLength = localImageStorage.length;
      localImageStorage = localImageStorage.filter(img => img.id !== id);
      return localImageStorage.length < initialLength;
    }
    
    // Otherwise try with Supabase
    try {
      const { error } = await supabase
        .from("images")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      // Fall back to local storage (just in case)
      console.log("Error deleting image from database:", error);
      const initialLength = localImageStorage.length;
      localImageStorage = localImageStorage.filter(img => img.id !== id || img.user_id !== userId);
      return localImageStorage.length < initialLength;
    }
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

// Function to get image statistics with fallback
export const getImageStats = async (userId: string) => {
  try {
    // Try with Supabase first
    try {
      const { data, error } = await supabase
        .from("images")
        .select("*")
        .eq("user_id", userId);
        
      if (error) throw error;
      
      // Calculate stats
      const totalImages = data.length;
      const mostRecentImage = data.length > 0 ? 
        data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : 
        null;
      
      return {
        totalImages,
        mostRecentImage,
      };
    } catch (error) {
      // Fall back to local storage
      console.error("Error getting image stats from database, using local storage:", error);
      const userImages = localImageStorage.filter(img => img.user_id === userId);
      return {
        totalImages: userImages.length,
        mostRecentImage: userImages.length > 0 ? userImages[0] : null
      };
    }
  } catch (error) {
    console.error("Error getting image stats:", error);
    return {
      totalImages: 0,
      mostRecentImage: null,
    };
  }
};
