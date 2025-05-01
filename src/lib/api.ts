
import { supabase } from "./supabase";

// This function will call a free external API to generate images from text
// For demonstration purposes, we're using a placeholder image API
// In production, you'd implement the actual API call to a real image generation API
export const generateImage = async (prompt: string): Promise<string> => {
  // Simulating API call with delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Using Lorem Picsum as a placeholder for image generation
  // In a real app, this would call a proper image generation API like DALL-E, Midjourney API, etc.
  const randomId = Math.floor(Math.random() * 1000);
  const imageUrl = `https://picsum.photos/seed/${prompt.replace(/\s+/g, '-').toLowerCase()}-${randomId}/800/800`;
  
  // Log generation event to analytics (optional)
  console.log(`Generated image for prompt: "${prompt}"`);
  
  return imageUrl;
};

// Function to get image statistics
export const getImageStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("user_id", userId);
      
    if (error) throw error;
    
    // Calculate stats
    const totalImages = data.length;
    const mostRecentImage = data.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    
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
