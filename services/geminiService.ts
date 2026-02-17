
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing with named parameter as per @google/genai guidelines.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getAiInsight(prompt: string): Promise<string> {
    if (!process.env.API_KEY) return "AI পরামর্শ বর্তমানে উপলব্ধ নয়।";
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "আপনি ইকোর ডেইরি খামারের একজন অভিজ্ঞ কৃষি বিশেষজ্ঞ এবং খামার ব্যবস্থাপক। খামারিদের গবাদি পশুর স্বাস্থ্য, দুধের উৎপাদন বৃদ্ধি এবং আধুনিক খামার পরিচালনা সম্পর্কে সঠিক ও সংক্ষিপ্ত পরামর্শ দিন। উত্তরগুলো বাংলায় দিন।",
          temperature: 0.7,
        },
      });
      // Extracting text output directly from the .text property of GenerateContentResponse.
      return response.text || "কোনো তথ্য পাওয়া যায়নি।";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "AI এর সাথে যোগাযোগ করতে সমস্যা হচ্ছে।";
    }
  }

  async getSectionArticles(topic: string, language: string): Promise<any[]> {
    if (!process.env.API_KEY) return [];

    try {
      const prompt = `Generate 3-5 short professional articles about "${topic}" in the context of an organic dairy farm.
      Language: ${language === 'bn' ? 'Bengali' : 'English'}.
      Return exactly a JSON array of objects with 'title' and 'description' (max 2 lines).`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          }
        }
      });

      // Extracting text output directly from the .text property of GenerateContentResponse.
      const text = response.text || "[]";
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Articles Error:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
