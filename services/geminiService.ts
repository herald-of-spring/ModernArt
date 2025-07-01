
import { GoogleGenAI } from "@google/genai";
import { Artist } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateArtDescription = async (artist: Artist, cardId: string): Promise<string> => {
  if (!API_KEY) {
    return "The resident art critic is currently unavailable. Please admire the piece in silence.";
  }

  const prompt = `You are an eloquent and slightly pretentious art critic for a high-end gallery.
  A piece by the modern artist ${artist} is up for auction. The piece is part of their collection, identified as "${cardId}".
  The artist's style blends pop art, street art, and surrealism.
  Write a short, evocative, and compelling description (2-3 sentences) for this specific painting to entice bidders.
  Focus on the feeling and potential meaning, not just a physical description. Make it sound valuable and important.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
       config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating art description:", error);
    return "An enigmatic silence surrounds this piece, leaving its interpretation entirely to the discerning collector.";
  }
};
