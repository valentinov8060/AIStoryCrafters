import axios from 'axios';
import { getSecureValue } from '../utils/secureStore';

interface CraftingStoryArgs {
  synopsis: string;
  wordsLength: number;
  complexity: number;
  genre: string;
  pointOfView: string;
}

const craftingStory = async (story: CraftingStoryArgs): Promise<string | null> => {
  try {
    const apiKey = await getSecureValue(process.env.EXPO_PUBLIC_KEY_SECURE_STORE_API_KEY_GROQ as string);

    // Kirim permintaan ke API
    const response = await axios.request({
      baseURL: 'https://api.groq.com/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`, // API Key dari Secure Store
      },
      data: {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that crafts stories.',
          },
          {
            role: 'user',
            content: `Create a story based on the following synopsis: "${story.synopsis}". The story should match the language of the synopsis and adhere to the specified parameters: ${story.wordsLength} words, written in the ${story.genre} genre, and told from a ${story.pointOfView} perspective.`
          },
        ],
        temperature: story.complexity/10,
      },
    });    

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
};

export {
  craftingStory
};
