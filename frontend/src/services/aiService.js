
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFormattedKnowledge } from '../data/chatbotKnowledge';

// Initialize the Gemini AI
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.error("CRITICAL: VITE_GEMINI_API_KEY is missing in environment variables!");
} else {
    console.log("Gemini API Key detected:", apiKey.substring(0, 5) + "...");
}

const genAI = new GoogleGenerativeAI(apiKey || "dummy_key");

// Helper to get model instance
const getModel = (modelName) => {
    return genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    });
};

// System prompt with knowledge base
const systemPrompt = getFormattedKnowledge();

/**
 * Send a message to the Gemini AI chatbot
 * @param {string} userMessage - The user's message
 * @param {Array} chatHistory - Previous chat messages for context
 * @returns {Promise<string>} - The AI's response
 */
export const sendMessage = async (userMessage, chatHistory = []) => {
    // Build the conversation context
    const conversationContext = chatHistory
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');

    // Combine system prompt, conversation history, and new message
    const fullPrompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}
User: ${userMessage}

Assistant:`;

    const attemptGenerate = async (modelName) => {
        try {
            console.log(`Attempting with ${modelName}...`);
            const model = getModel(modelName);
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error(`Error with ${modelName}:`, error);
            throw error;
        }
    };

    try {
        return await attemptGenerate('gemini-flash-latest');
    } catch (error) {
        console.warn("gemini-flash-latest failed, checking error...", error);
        // Fallback or rethrow
        if (error.toString().includes('404')) {
            return "Error: Model not found. This key appears to be valid for 'gemini-flash-latest', please check your quota.";
        }
        throw error;
    }
};
