import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithGemini(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [...history, { role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are the Nayyer Furniture AI Concierge. You are an expert in luxury interior design, artisanal furniture, and home styling. You help customers choose the right pieces from the Nayyer collection, which features Deep Charcoal, Warm Teak, and Artisanal Craftsmanship. Be sophisticated, helpful, and professional. If asked about specific products, describe them as high-end, handcrafted, and timeless.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I apologize, but I'm having trouble connecting right now. How else can I assist you with your luxury furniture needs?";
  }
}

export async function analyzeFurnitureImage(base64Image: string, prompt: string = "Analyze this furniture or room. What style is it? How would Nayyer's artisanal teak pieces complement this space?") {
  try {
    const imagePart: Part = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image.split(",")[1], // Remove the data:image/jpeg;base64, prefix
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [imagePart, { text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return "I'm sorry, I couldn't analyze the image at this time. Please try again or describe your space to me.";
  }
}
