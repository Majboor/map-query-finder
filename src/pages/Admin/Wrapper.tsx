import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { reformatResponse } from "@/utils/responseMapper";

const DEFAULT_API_KEY = "YjE5YzI1NzQ0MTRjNGQwOWJmYzU3YzZmNmU5NDZiNTZ8N2Y5YWRkMjA2Ng";

const Wrapper = () => {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [limit, setLimit] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Combine query and location into a single search string
      const searchQuery = `${query} ${location}`.trim();
      
      const params = new URLSearchParams({
        query: searchQuery,
        limit: limit,
        async: "false",
        language: "en",
        region: "AU",
        dropDuplicates: "true"
      });

      console.log("API Request URL:", `https://api.app.outscraper.com/maps/search-v3?${params}`);
      console.log("Query Parameters:", {
        query: searchQuery,
        limit: limit,
        async: "false",
        language: "en",
        region: "AU",
        dropDuplicates: "true"
      });

      const response = await fetch(`https://api.app.outscraper.com/maps/search-v3?${params}`, {
        headers: {
          "X-API-KEY": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Original API Response:", data);
      
      const reformattedData = reformatResponse(data);
      console.log("Reformatted Response:", reformattedData);
      
      setResponse(reformattedData);
      toast.success("API call successful!");
    } catch (err) {
      console.error("API Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch data from API");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Wrapper Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <Textarea
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key or use default..."
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              Leave blank to use the default API key
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Query</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Result Limit</label>
            <Input
              type="number"
              min="1"
              max="20"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="Enter number of results..."
            />
            <p className="text-sm text-muted-foreground">
              Maximum 20 results per request
            </p>
          </div>
          <Button 
            onClick={handleTest} 
            disabled={isLoading || !query || !location}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing API...
              </>
            ) : (
              "Test API"
            )}
          </Button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {response && (
            <div className="mt-4 space-y-2">
              <p className="font-medium">Reformatted API Response:</p>
              <pre className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wrapper;