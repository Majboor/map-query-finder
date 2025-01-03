import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "https://api.app.outscraper.com/maps/search-v3";
  const API_KEY = "YjE5YzI1NzQ0MTRjNGQwOWJmYzU3YzZmNmU5NDZiNTZ8N2Y5YWRkMjA2Ng";

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const params = new URLSearchParams({
        query: `${query}, ${location}`,
        limit: "1",
        async: "false",
      });

      console.log("API Request URL:", `${API_BASE_URL}?${params}`);
      console.log("Query Parameters:", {
        query: `${query}, ${location}`,
        limit: "1",
        async: "false",
      });

      const response = await fetch(`${API_BASE_URL}?${params}`, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      const data = await response.json();
      console.log("API Response:", data);
      setResponse(data);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

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
          <CardTitle>API Testing Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <p className="font-medium">API Response:</p>
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

export default Admin;