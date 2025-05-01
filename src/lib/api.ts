
import { supabase } from "./supabase";

// Deep Image API for generating images from text prompts
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const API_KEY = "2a1daf90-26b5-11f0-a376-3380a07e162f";
    
    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({ text: prompt }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.output_url) {
      // Log generation event to analytics (optional)
      console.log(`Generated image for prompt: "${prompt}"`);
      return data.output_url;
    } else {
      throw new Error("No image URL returned from API");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
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
