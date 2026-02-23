
import { GoogleGenAI, Type } from "@google/genai";
import { ThemeType, VenueRecommendation } from "../types";

// Helper to generate heartfelt Valentine's messages using AI.
export const generateLoveMessage = async (mood: string, crushName: string, theme: ThemeType) => {
  // Always initialize GoogleGenAI with a named parameter and direct process.env.API_KEY right before making the call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a short, heartfelt Valentine's proposal message for ${crushName || 'someone special'}. 
    Tone: ${mood}. Theme context: ${theme}. 
    Make it creative and emotional, maximum 300 characters.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Extract text from response.text property.
    return response.text || "You are the light in my life. Will you be my Valentine?";
  } catch (error) {
    console.error("AI Error:", error);
    return "I've been meaning to tell you how much you mean to me. Will you be mine?";
  }
};

// Fetches venue recommendations using Gemini with search grounding.
export const getVenueRecommendations = async (
  city: string, 
  latitude: number,
  longitude: number
): Promise<VenueRecommendation[]> => {
  // Always initialize GoogleGenAI right before the API call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `List the top 4 highly rated (4+ stars) romantic restaurants and venues near ${city}, Sri Lanka (coordinates: ${latitude}, ${longitude}). 
    Return the data in JSON format with properties: name, address, rating, url (Google Maps link).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              address: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              url: { type: Type.STRING },
            },
            required: ["name", "address", "rating", "url"],
            // Corrected: propertyOrdering should be inside the object schema.
            propertyOrdering: ["name", "address", "rating", "url"],
          },
        },
        tools: [{ googleSearch: {} }]
      }
    });
    
    // Using response.text to access the returned JSON string directly.
    const text = response.text?.trim() || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Venue search error:", error);
    return [];
  }
};
