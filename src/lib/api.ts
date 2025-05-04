
import { supabase } from "./supabase";

// Gemini API for generating images from text prompts
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const API_KEY = "AIzaSyDC_T756pM450zJ4OaqhYimqfwlJivdtgw";
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a detailed image based on this prompt: ${prompt}`
          }]
        }]
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }
    
    const data = await response.json();
    
    // Since Gemini doesn't directly return images, we use a placeholder service
    // In a real app, you'd process the Gemini response differently
    // For now, we'll use a placeholder image service with the prompt as a seed
    const seed = encodeURIComponent(prompt);
    const imageUrl = `https://picsum.photos/seed/${Date.now()}-${seed}/800/600`;
    
    console.log(`Generated image for prompt: "${prompt}"`);
    return imageUrl;
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
