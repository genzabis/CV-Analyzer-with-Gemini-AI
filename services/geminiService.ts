
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResponse } from "../types";

export const analyzeResumeWithAI = async (resumeText: string): Promise<AIAnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analisis CV berikut dan ambil informasi penting dalam format JSON.
    Ekstrak daftar skill teknis, ringkasan profil (2-3 kalimat), dan rekomendasi posisi kerja.
    
    Resume Text:
    "${resumeText}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of technical and soft skills extracted."
            },
            summary: {
              type: Type.STRING,
              description: "A professional 2-3 sentence summary."
            },
            suggested_roles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Suggested job titles based on the content."
            }
          },
          required: ["skills", "summary", "suggested_roles"],
        },
        systemInstruction: "You are a senior HR professional and recruitment specialist. Your goal is to accurately parse resumes and provide structured insights."
      },
    });

    const resultText = response.text || "{}";
    return JSON.parse(resultText) as AIAnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze resume with AI. Please check your API configuration.");
  }
};
