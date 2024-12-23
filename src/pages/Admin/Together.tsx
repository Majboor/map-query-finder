import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ApiUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

const TOGETHER_API_KEY = localStorage.getItem('TOGETHER_API_KEY') || '';

const Together = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiUsage, setApiUsage] = useState<ApiUsage | null>(null);
  const [apiKey, setApiKey] = useState(TOGETHER_API_KEY);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      toast.error("Please enter your Together AI API key first");
      return;
    }

    try {
      setIsLoading(true);
      const userMessage: Message = { role: "user", content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput("");

      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: [...messages, userMessage],
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
        throw new Error("Failed to get response from Together API");
      }

      const data = await response.json();
      
      // Handle function calls if present
      if (data.choices[0].message.tool_calls) {
        const toolCall = data.choices[0].message.tool_calls[0];
        if (toolCall.function.name === "get_place_details") {
          const args = JSON.parse(toolCall.function.arguments);
          const placesResponse = await fetch(`https://api.app.outscraper.com/maps/search-v3?query=${encodeURIComponent(args.query)}, ${encodeURIComponent(args.location)}&limit=1&async=false`, {
            headers: {
              "X-API-KEY": "YjE5YzI1NzQ0MTRjNGQwOWJmYzU3YzZmNmU5NDZiNTZ8N2Y5YWRkMjA2Ng"
            }
          });

          if (!placesResponse.ok) {
            throw new Error("Failed to get response from Places API");
          }

          const placesData = await placesResponse.json();
          setMessages(prev => [...prev, {
            role: "assistant",
            content: JSON.stringify(placesData.data[0], null, 2)
          }]);
        }
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.choices[0].message.content
      }]);

      if (data.usage) {
        setApiUsage({
          prompt_tokens: data.usage.prompt_tokens,
          completion_tokens: data.usage.completion_tokens,
          total_tokens: data.usage.total_tokens
        });
      }

      // Save API key if request was successful
      if (apiKey !== TOGETHER_API_KEY) {
        localStorage.setItem('TOGETHER_API_KEY', apiKey);
      }

      toast.success("Response received successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="min-h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <div className="space-y-2">
            <label className="text-sm font-medium">Together AI API Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Together AI API key..."
              className="font-mono"
            />
          </div>
          {apiUsage && (
            <div className="text-sm text-muted-foreground">
              Tokens: {apiUsage.prompt_tokens} prompt + {apiUsage.completion_tokens} completion = {apiUsage.total_tokens} total
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 h-[400px] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">
                      {message.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Together;