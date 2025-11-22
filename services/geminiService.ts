import { GoogleGenAI, Type } from "@google/genai";
import { Module } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// 1. Generate a new Course Module based on a topic
export const generateModuleContent = async (topic: string): Promise<Module | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a detailed training module for a business course about "${topic}". 
      The output must be a JSON object representing a Module.
      Include 2-3 lessons. The content of lessons should be informative educational text (approx 100 words each).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            lessons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER }
                },
                required: ['id', 'title', 'content', 'durationMinutes']
              }
            }
          },
          required: ['id', 'title', 'description', 'lessons']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Module;
    }
    return null;
  } catch (error) {
    console.error("Gemini generation error:", error);
    return null;
  }
};

// 2. AI Tutor Chat
export const askAITutor = async (context: string, question: string, history: {role: string, text: string}[]): Promise<string> => {
  try {
    const systemInstruction = `You are an expert mentor for Forever Business Owners (FBOs). 
    You are helpful, encouraging, and professional. 
    Answer the student's question based on the following lesson context: 
    ---
    ${context}
    ---
    If the answer is not in the context, use your general business knowledge but mention that it goes beyond the current lesson. keep answers concise (under 100 words).`;

    // Construct chat history for the model
    // Note: The SDK chat format requires mapping our simplified history to the SDK's content format if using chats.create
    // For a single turn with context, generateContent is sufficient and often simpler for "RAG-lite"
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini Tutor error:", error);
    return "Sorry, I'm having trouble connecting to the FBO network right now.";
  }
};
