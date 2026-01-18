import { GoogleGenAI } from "@google/genai";
import { AppSettings, Member, Cycle } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getCommitteeAdvice = async (
  query: string,
  settings: AppSettings,
  members: Member[],
  cycles: Cycle[]
): Promise<string> => {
  if (!apiKey) {
    return "Please configure the API Key to use the AI Advisor.";
  }

  const model = "gemini-3-flash-preview";
  
  const systemContext = `
    You are an expert financial advisor specifically for informal savings circles (ROSCA/Committee/Qisst).
    
    Current Committee Data:
    - Name: ${settings.committeeName}
    - Installment Amount: ${settings.currency} ${settings.installmentAmount}
    - Frequency: ${settings.frequency}
    - Total Members: ${members.length}
    - Members who have already received the pot: ${members.filter(m => m.hasReceivedPot).map(m => m.name).join(', ') || 'None'}
    - Current Cycle Count: ${cycles.length}
    
    User Query: ${query}
    
    Provide a helpful, polite, and professional answer. Keep it concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: systemContext }] },
      ]
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I am having trouble connecting to the advice service right now.";
  }
};
