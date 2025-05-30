import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log('Gemini API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT LOADED');

const genAI = new GoogleGenerativeAI(apiKey);

export interface GeminiResponse {
  content: string;
  error?: string;
}

// List of model names to try in order
const modelNames = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro-latest',
  'gemini-1.0-pro',
  'gemini-pro'
];

export const sendMessageToGemini = async (message: string): Promise<GeminiResponse> => {
  for (const modelName of modelNames) {
    try {
      console.log(`Trying model: ${modelName}`);
      
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: modelName });

      // Generate content
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      console.log(`Success with model: ${modelName}`);
      return {
        content: text
      };
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error);
      
      // If this isn't the last model to try, continue to the next one
      if (modelName !== modelNames[modelNames.length - 1]) {
        continue;
      }
      
      // Handle specific error cases for the last attempt
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          return {
            content: '',
            error: 'None of the Gemini models are available. Please check your API key or try again later.'
          };
        }
        if (error.message.includes('API key') || error.message.includes('PERMISSION_DENIED')) {
          return {
            content: '',
            error: 'Invalid API key or insufficient permissions. Please check your Gemini API key configuration.'
          };
        }
        if (error.message.includes('QUOTA_EXCEEDED')) {
          return {
            content: '',
            error: 'API quota exceeded. Please try again later or upgrade your plan.'
          };
        }
      }
      
      return {
        content: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
  
  // This should never be reached, but just in case
  return {
    content: '',
    error: 'All model attempts failed'
  };
}; 