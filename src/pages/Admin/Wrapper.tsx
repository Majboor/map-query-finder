import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_API_KEY = "YjE5YzI1NzQ0MTRjNGQwOWJmYzU3YzZmNmU5NDZiNTZ8N2Y5YWRkMjA2Ng";

const Wrapper = () => {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const reformatResponse = (data: any) => {
    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
      return { results: [] };
    }

    const place = data.data[0];
    if (!place) return { results: [] };

    // Convert working_hours to our expected format
    const workingHours = place.working_hours || {};
    
    // Map the API response to our expected format
    return {
      results: [{
        "Business Name": place.name || "N/A",
        "Business Address": place.full_address || "N/A",
        "Business Phone": place.phone || "N/A",
        "Business Email": place.details?.["Business Email"] || "N/A",
        "Business Description": place.description || "N/A",
        "Website URL": place.site || "N/A",
        "Latitude": place.latitude || 0,
        "Longitude": place.longitude || 0,
        "Brand Images": [
          place.logo || "N/A",
          place.photo || "N/A"
        ],
        "Hours": workingHours || {
          "Monday": "Closed",
          "Tuesday": "Closed",
          "Wednesday": "Closed",
          "Thursday": "Closed",
          "Friday": "Closed",
          "Saturday": "Closed",
          "Sunday": "Closed"
        },
        "Category": place.type || "N/A",
        "Tagline": place.type || "N/A",
        "Owner Name": place.owner_title || "N/A",
        "Verified": place.verified || false,
        "Owner Link": place.owner_link || "N/A"
      }]
    };
  };

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const params = new URLSearchParams({
        query: `${query}, ${location}`,
        limit: "1",
        async: "false",
        language: "en",
        region: "AU"
      });

      console.log("API Request URL:", `https://api.app.outscraper.com/maps/search-v3?${params}`);
      console.log("Query Parameters:", {
        query: `${query}, ${location}`,
        limit: "1",
        async: "false",
        language: "en",
        region: "AU"
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