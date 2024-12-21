import { toast } from "sonner";
import type { Place, PlaceDetails } from "@/types/place";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.app.outscraper.com/maps/search-v3";
const API_KEY = import.meta.env.VITE_API_KEY;

export interface SearchParams {
  query: string;
  location: string;
  limit?: number;
  skipPlaces?: number;
}

const mapApiResponseToPlace = (placeData: any): Place => {
  return {
    name: placeData.name,
    rating: placeData.rating,
    address: placeData.full_address,
    phone: placeData.phone,
    website: placeData.site,
    reviews_count: placeData.reviews,
  };
};

export { type Place };  // Export the Place type

export const searchPlaces = async ({ query, location, limit = 1, skipPlaces = 0 }: SearchParams): Promise<Place[]> => {
  try {
    // Ensure skipPlaces is a multiple of 20
    const adjustedSkipPlaces = Math.floor(skipPlaces / 20) * 20;

    const params = new URLSearchParams({
      query: `${query}, ${location}`,
      limit: limit.toString(),
      skipPlaces: adjustedSkipPlaces.toString(),
      async: "false",
      language: "en",
      region: "AU",
      dropDuplicates: "true"
    });

    console.log("API Request URL:", `${API_BASE_URL}?${params}`);
    console.log("Query Parameters:", Object.fromEntries(params));

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        toast.error("Unauthorized. Check your API key.");
        throw new Error('Unauthorized');
      } else if (response.status === 402) {
        toast.error("Payment required. Check your account billing.");
        throw new Error('Payment required');
      } else if (response.status === 422) {
        toast.error("Invalid request parameters.");
        throw new Error('Invalid parameters');
      } else {
        toast.error(`API Error: ${response.status}`);
        throw new Error('Failed to fetch places');
      }
    }

    const data: PlaceDetails = await response.json();
    console.log("API Response:", data);

    if (data.status === "Success" && Array.isArray(data.data) && data.data.length > 0 && Array.isArray(data.data[0])) {
      return data.data[0].map(mapApiResponseToPlace);
    }

    return [];
  } catch (error) {
    console.error("Places API Error:", error);
    throw error;
  }
};