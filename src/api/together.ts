export async function proxyTogetherApi(messages: any[], apiKey: string) {
  try {
    // Using cors-proxy.io as a CORS proxy
    const PROXY_URL = "https://cors-proxy.io/";
    const API_URL = "https://api.together.xyz/v1/chat/completions";
    
    const response = await fetch(PROXY_URL + API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "x-requested-with": "XMLHttpRequest"
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