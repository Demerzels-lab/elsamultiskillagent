import { Skill } from './types';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function generateSystemPrompt(skill: Skill): string {
  return `
### MISSION
You are an advanced AI Simulator. Your job is to roleplay a Command Line Interface (CLI) tool called "${skill.name}".

### KNOWN DATA
- **Tool Name:** ${skill.name}
- **Description:** ${skill.description}
- **Category:** ${skill.category}
- **Author:** ${skill.author}

### YOUR INSTRUCTIONS (The "Improvisation" Protocol)
The user is "Test Driving" this tool on a website. You do not have the real code, so you must **HALLUCINATE** a realistic experience.

1. **Infer Functionality:** - Look at the NAME and DESCRIPTION. Invent features that make sense.
   - Example: If named "pdf-helper", invent commands like "merge", "split", "extract".
   - **Assume the tool works perfectly.**

2. **Interaction Style:**
   - Act exactly like a terminal/console. 
   - Use emojis like ✅, ❌, 📦, 🚀 to make it look modern.
   - Do NOT say "I am an AI". Stay in character.

3. **Handling User Input:**
   - If the user says "help" or "start", show a menu of fake commands they can run.
   - If the user runs a command, generate a realistic success output.

### EXAMPLE START
"🚀 ${skill.name} v1.0 initialized. Ready for command. Type 'help' to see available options."
`.trim();
}

export async function sendMessageToAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  // 1. Debugging Log: Check if API Key exists
  console.log("🔗 Attempting AI Connection...");
  console.log("🔑 API Key Status:", apiKey ? "Present (Starts with " + apiKey.substring(0, 4) + "...)" : "MISSING");

  if (!apiKey) {
    console.warn("⚠️ VITE_OPENROUTER_API_KEY is missing in .env file.");
    // Simulate a response for testing UI without API key
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("⚠️ **System Warning:** API Key missing. Please add VITE_OPENROUTER_API_KEY to your .env file to enable real AI responses.\n\n(Simulated) Command received.");
      }, 1000);
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "Elsa Agent Protocol",      // Optional: App name
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "mistralai/ministral-3b-2512", // Free model
        "messages": messages
      })
    });

    // 2. Handle API Errors (4xx, 5xx)
    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ OpenRouter API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errText
      });
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ AI Response Received:", data);
    return data.choices[0]?.message?.content || "No response content received.";
    
  } catch (error) {
    // 3. Handle Network/Fetch Errors
    console.error("❌ FULL CONNECTION ERROR DETAILS:", error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return "❌ **Network Error:** Could not connect to OpenRouter. Check your internet connection or CORS settings.";
    }

    return "❌ **Connection Error:** Failed to reach the neural network. Check the console (F12) for details.";
  }
}