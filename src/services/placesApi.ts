import { toast } from "sonner";
import type { Place } from "@/types/place";
import { reformatResponse } from "@/utils/responseMapper";

const API_BASE_URL = "https://api.app.outscraper.com/maps/search-v3";

export interface SearchParams {
  brand: string;
  location: string;
  limit?: number;
}

export { type Place };

export const searchPlaces = async ({ brand, location, limit = 5 }: SearchParams): Promise<Place[]> => {
  try {
    const params = new URLSearchParams({
      query: `${brand} ${location}`,
      limit: limit.toString(),
      async: "false",
      language: "en",
      region: "AU",
      dropDuplicates: "true"
    });

    const API_KEY = "YjE5YzI1NzQ0MTRjNGQwOWJmYzU3YzZmNmU5NDZiNTZ8N2Y5YWRkMjA2Ng";

    console.log("API Request URL:", `${API_BASE_URL}?${params}`);
    console.log("Query Parameters:", Object.fromEntries(params));

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });

    switch (response.status) {
      case 200:
        const data = await response.json();
        console.log("Original API Response:", data);
        
        if (data.status === "Success" && data.data) {
          const reformattedData = reformatResponse(data);
          console.log("Reformatted Response:", reformattedData);
          return reformattedData.results;
        } else {
          throw new Error("Invalid response format from API");
        }
        
      case 202:
        const asyncData = await response.json();
        toast.info(`Async request initiated - Request ID: ${asyncData.id}`);
        return [];
        
      case 204:
        toast.warning("No results found");
        return [];
        
      case 401:
        toast.error("Invalid API Key");
        throw new Error("Invalid API Key");
        
      case 402:
        toast.error("Payment required - Check your API subscription");
        throw new Error("Payment required");
        
      case 422:
        toast.error("Invalid query parameters");
        throw new Error("Invalid query parameters");
        
      default:
        throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Places API Error:", error);
    throw error;
  }
};