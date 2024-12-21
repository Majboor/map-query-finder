import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PlaceDetailsProps {
  query: string;
  location: string;
}

const PlaceDetails = ({ query, location }: PlaceDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "https://api.app.outscraper.com/maps/search-v3";
  const API_KEY = "YjE5YzI1NzQ0MTRjNGQwOWJmYzU3YzZmNmU5NDZiNTZ8N2Y5YWRkMjA2Ng";

  const fetchPlaceDetails = async () => {
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

      toast.success("Place details fetched successfully!");
    } catch (err) {
      console.error("API Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch place details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Place Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={fetchPlaceDetails} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading details...
            </>
          ) : (
            "View Details"
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
  );
};

export default PlaceDetails;