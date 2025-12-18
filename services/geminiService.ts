import { GoogleGenAI, Type } from "@google/genai";
import { Module, Chapter } from '../types';

// Fix: Use process.env.API_KEY directly in the initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Generate a new Course Module based on a topic
export const generateModuleContent = async (topic: string): Promise<Module | null> => {
  try {
    // Fix: Updated model to gemini-3-flash-preview for text generation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a detailed training module for a business course about "${topic}". 
      The output must be a JSON object.
      Include 2-3 lessons (chapters). The content of chapters should be informative educational text (approx 150 words each) formatted in Markdown.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  actionSteps: { 
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                  }
                },
                required: ['title', 'content', 'durationMinutes', 'actionSteps']
              }
            }
          },
          required: ['title', 'summary', 'chapters']
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Map to ensure IDs and types are correct
      const module: Module = {
          id: `mod_ai_${Date.now()}`,
          title: data.title,
          summary: data.summary,
          order: 0, // Assigned by caller
          chapters: data.chapters.map((c: any, idx: number) => ({
              id: `chap_ai_${Date.now()}_${idx}`,
              title: c.title,
              content: c.content,
              durationMinutes: c.durationMinutes,
              actionSteps: c.actionSteps || [],
              type: 'TEXT',
              isPublished: true,
              blocks: [
                  { id: `b1_${idx}`, type: 'heading', style: 'h2', content: c.title },
                  { id: `b2_${idx}`, type: 'paragraph', content: c.content }
              ]
          }))
      };
      return module;
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
    // Fix: Updated model to gemini-3-flash-preview for chat tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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

// 3. Analyze Receipt Image
export const analyzeReceipt = async (base64Image: string): Promise<{ amount: number, transactionId: string } | null> => {
  try {
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    // Updated: Following guideline for multiple parts using object format in contents
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          { text: "Analyze this receipt. Extract the Total Amount Paid (as a number) and the Transaction ID (or Receipt Number). Return JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                amount: { type: Type.NUMBER },
                transactionId: { type: Type.STRING }
            },
            required: ['amount']
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Receipt Analysis Error:", error);
    return null;
  }
};

// 4. Generate Onboarding Plan
export const generateOnboardingPlan = async (name: string, goal: string, availability: string): Promise<string> => {
    try {
        // Fix: Updated model to gemini-3-flash-preview for text tasks
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Create a short, personalized, motivating 3-step 'First Week Plan' for a new business owner named ${name}. 
            Their primary goal is: ${goal}.
            Their availability is: ${availability}.
            Format as a simple Markdown list. Keep it encouraging and specific to Network Marketing basics (List making, contacting, product use).`,
        });
        return response.text || "1. Make a list of 10 friends.\n2. Try the products yourself.\n3. Watch the training videos.";
    } catch (error) {
        console.error("Gemini Onboarding Error:", error);
        return "1. Make a list of 10 friends.\n2. Try the products yourself.\n3. Watch the training videos.";
    }
};