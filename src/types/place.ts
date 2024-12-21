export interface PlaceApiResponse {
  results: Place[];
}

export interface Place {
  "Business Name": string;
  "Business Address": string;
  "Business Description": string;
  "Business Email": string;
  "Business Phone": string;
  "Website URL": string;
  "Latitude": number;
  "Longitude": number;
  "Hours": Record<string, string>;
  "Owner Name"?: string;
  "Verified"?: boolean;
  "Owner Link"?: string;
  "Brand Images": string[];
}

export interface PlaceData {
  name: string;
  full_address: string;
  description?: string;
  email?: string;
  phone?: string;
  site?: string;
  latitude?: number;
  longitude?: number;
  working_hours?: Record<string, string>;
  business_status?: string;
  price_level?: number;
  reviews?: Review[];
  brand_images?: string[];
}

export interface Review {
  rating: number;
  text: string;
}