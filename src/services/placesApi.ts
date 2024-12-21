import { toast } from "sonner";
import type { Place, PlaceApiResponse } from "@/types/place";

const API_BASE_URL = "http://45.90.122.221:5001";

export interface SearchParams {
  brand: string;
  location: string;
  limit?: number;
}

const mapApiResponseToPlace = (placeData: Place): Place => {
  return {
    "Business Name": placeData["Business Name"],
    "Business Address": placeData["Business Address"],
    "Business Description": placeData["Business Description"],
    "Business Email": placeData["Business Email"],
    "Business Phone": placeData["Business Phone"],
    "Website URL": placeData["Website URL"],
    "Latitude": placeData["Latitude"],
    "Longitude": placeData["Longitude"],
    "Hours": placeData["Hours"],
    "Brand Images": placeData["Brand Images"],
    "Owner Name": placeData["Owner Name"],
    "Verified": placeData["Verified"],
    "Owner Link": placeData["Owner Link"]
  };
};

export { type Place };

export const searchPlaces = async ({ brand, location, limit = 5 }: SearchParams): Promise<Place[]> => {
  try {
    const params = new URLSearchParams({
      brand,
      location,
      limit: limit.toString()
    });

    console.log("API Request URL:", `${API_BASE_URL}/search?${params}`);
    console.log("Query Parameters:", Object.fromEntries(params));

    const response = await fetch(`${API_BASE_URL}/search?${params}`);

    if (!response.ok) {
      if (response.status === 400) {
        toast.error("Invalid request parameters.");
        throw new Error('Invalid parameters');
      } else {
        toast.error(`API Error: ${response.status}`);
        throw new Error('Failed to fetch places');
      }
    }

    const data: PlaceApiResponse = await response.json();
    console.log("API Response:", data);

    if (data.results && Array.isArray(data.results)) {
      return data.results.map(mapApiResponseToPlace);
    }

    return [];
  } catch (error) {
    console.error("Places API Error:", error);
    throw error;
  }
};