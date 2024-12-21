export interface PlaceDetails {
  status: string;
  data: Array<Array<PlaceData>>;
}

export interface PlaceData {
  name: string;
  details?: {
    'Business Email'?: string;
  };
  phone?: string;
  site?: string;
  full_address?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  popular_times?: Array<{
    day_text: string;
    popular_times: Array<{
      time: string;
      percentage: number;
    }>;
  }>;
  working_hours?: Record<string, string>;
  logo?: string;
  photo?: string;
  business_status?: string;
  price_level?: number;
  reviews?: Array<{
    rating: number;
    text: string;
  }>;
}

export interface WorkingHours {
  [key: string]: string;
}