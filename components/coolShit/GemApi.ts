// this is suppose to be the part where i call the google llm to enhance the shit description they put.
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "" });

const GemApi = async (value:string ):Promise<string | undefined> =>{
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Refine these sentence to sound more professional" + value,
  });
  return response.text;
}

export default GemApi;






