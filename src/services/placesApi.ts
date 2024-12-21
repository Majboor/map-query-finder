import { toast } from "sonner";

const API_BASE_URL = "https://api.app.outscraper.com/maps/search-v3";

export interface SearchParams {
  query: string;
  location: string;
  limit?: number;
  skipPlaces?: number;
}

export interface Place {
  name: string;
  rating?: number;
  address?: string;
  phone?: string;
  website?: string;
  reviews_count?: number;
}

export const searchPlaces = async ({ query, location, limit = 1, skipPlaces = 0 }: SearchParams) => {
  try {
    const params = new URLSearchParams({
      query: `${query}, ${location}`,
      limit: limit.toString(),
      skipPlaces: skipPlaces.toString(),
      async: "false",
    });

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      headers: {
        "X-API-KEY": "YOUR-API-KEY", // Replace with actual API key handling
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch places");
    }

    const data = await response.json();
    return data.data[0] as Place[];
  } catch (error) {
    toast.error("Error fetching places");
    return [];
  }
}