// this is suppose to be the part where i call the google llm to enhance the shit description they put.
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDKeafXInltfjdk8gtaZNhAh5JzYRhksfo" });

const GemApi = async (value:string ):Promise<string | undefined> =>{
  console.log("calling gemini api");
  try {
    if(value!= ""){
      const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "I want to you to refine these sentence whatever feel best for you and provide me the output:" + value,
      });
      console.log(response.text);
      return response.text;
    }else{
      console.log("Empty description field")
      return value;
    }
  
  } catch (error) {
    console.log(error);
  }

  console.log("gemini api end");
  return value;

}

export default GemApi;






