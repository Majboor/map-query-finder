import { Message, Tool, TogetherResponse } from "../types/together";

export async function callTogetherApi(messages: Message[], apiKey: string, tools?: Tool[]): Promise<TogetherResponse> {
  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages,
        tools: tools || [],
        tool_choice: "auto"
      })
    });

    if (!response.ok) {
      throw new Error(`Together API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling Together API:", error);
    throw error;
  }
}