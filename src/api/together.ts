export async function proxyTogetherApi(messages: any[], apiKey: string) {
  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages,
        tools: [{
          type: "function",
          function: {
            name: "get_place_details",
            description: "Fetch details about a place from the Places API",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "Search query for the place" },
                location: { type: "string", description: "Location for the search" }
              }
            }
          }
        }],
        tool_choice: "auto"
      })
    });

    if (!response.ok) {
      throw new Error(`Together API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error communicating with Together API:", error);
    throw error;
  }
}