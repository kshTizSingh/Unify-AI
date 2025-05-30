import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export async function sendMessageToOpenAI(message: string) {
  try {
    // Log API key status for debugging
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('OpenAI API Key status:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response content received from OpenAI');
    }

    return {
      content,
      error: null
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    let errorMessage = 'Failed to get response from OpenAI';
    
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Invalid OpenAI API key. Please check your API key configuration.';
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        errorMessage = 'OpenAI rate limit exceeded. This could mean:\n• You\'ve reached your monthly usage quota\n• Too many requests per minute\n• Your API key is on the free tier with low limits\n\nTry again in a few minutes or upgrade your OpenAI plan.';
      } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
        errorMessage = 'OpenAI API server error. The service might be temporarily unavailable. Please try again in a moment.';
      } else if (error.message.includes('insufficient_quota')) {
        errorMessage = 'OpenAI quota exceeded. You\'ve reached your usage limit for this billing period. Please add credits to your OpenAI account or wait for the next billing cycle.';
      } else if (error.message.includes('model_not_found')) {
        errorMessage = 'OpenAI model not found. The requested model might not be available with your API key.';
      } else {
        errorMessage = `OpenAI Error: ${error.message}`;
      }
    }
    
    return {
      content: '',
      error: errorMessage
    };
  }
} 