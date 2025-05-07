import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from  "@google/generative-ai";

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", safetySettings });

export default model;