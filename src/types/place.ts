export interface PlaceDetails {
  id: string;
  status: string;
  data: Array<Array<PlaceData>>;
}

export interface PlaceData {
  query: string;
  name: string;
  name_for_emails?: string;
  place_id: string;
  google_id: string;
  full_address: string;
  borough?: string | null;
  street: string;
  postal_code: string;
  area_service: boolean;
  country_code: string;
  country: string;
  city: string;
  us_state: string | null;
  state: string;
  plus_code: string;
  latitude: number;
  longitude: number;
  h3: string;
  time_zone: string;
  popular_times: PopularTimesDay[];
  site?: string;
  phone?: string;
  type: string;
  logo?: string;
  description?: string | null;
  typical_time_spent?: string | null;
  located_in?: string | null;
  located_google_id?: string | null;
  category: string;
  subtypes: string;
  posts?: any | null;
  reviews_tags?: string[];
  rating?: number;
  reviews?: Review[];  // Changed from number to array of Review
  photos_count?: number;
  cid: string;
  reviews_link: string;
  reviews_id: string;
  photo?: string;
  street_view?: string;
  working_hours?: Record<string, string>;
  working_hours_old_format?: string;
  other_hours?: any | null;
  business_status?: string;
  price_level?: number;  // Added price_level
  about?: {
    Accessibility?: Record<string, boolean>;
    Payments?: Record<string, boolean>;
  };
  range?: any | null;
  reviews_per_score?: Record<string, number>;
  reservation_links?: any | null;
  booking_appointment_link?: any | null;
  menu_link?: any | null;
  order_links?: any | null;
  owner_id?: string;
  verified?: boolean;
  owner_title?: string;
  owner_link?: string;
  location_link?: string;
  location_reviews_link?: string;
}

export interface Review {
  rating: number;
  text: string;
}

export interface PopularTimesDay {
  day: number;
  day_text: string;
  popular_times: PopularTime[];
}

export interface PopularTime {
  hour: number;
  percentage: number;
  title: string;
  time: string;
}

export interface Place {
  name: string;
  rating?: number;
  address?: string;
  phone?: string;
  website?: string;
  reviews_count?: number;
}