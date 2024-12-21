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
  "Operating Hours": Record<string, string>;
  "Open State": string;
  "Category": string;
  "Tagline": string;
  "Owner Name": string;
  "Products/Services": string[];
  "Social Media Links": string[];
  "Brand Images": string[];
  "Verified"?: boolean;
  "Owner Link"?: string;
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
  popular_times?: PopularTime[];
  about?: About;
}

export interface Review {
  rating: number;
  text: string;
}

export interface PopularTime {
  day_text: string;
  popular_times: Array<{
    hour: number;
    percentage: number;
    time: string;
  }>;
}

export interface About {
  description?: string;
  "From the business"?: {
    description?: string;
  };
}