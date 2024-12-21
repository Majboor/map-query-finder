import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Globe, ChevronDown, CheckSquare, Square } from "lucide-react";
import type { Place } from "@/services/placesApi";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { PlaceDetails } from "@/types/place";
import PlaceDetails from "./PlaceDetails";

interface PlaceCardProps {
  place: Place;
  onSelect?: (place: Place) => void;
  isSelected?: boolean;
}

const PlaceCard = ({ place, onSelect, isSelected = false }: PlaceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: details, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['placeDetails', place.name],
    queryFn: async () => {
      console.log('Fetching details for:', place.name);
      try {
        const params = {
          query: place.name,
          limit: '10',
          language: 'en',
          region: 'AU',
          async: 'false',
          dropDuplicates: 'true'
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/maps/search-v3?${new URLSearchParams(params)}`,
          {
            headers: {
              'X-API-KEY': import.meta.env.VITE_API_KEY,
            },
          }
        );

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
            throw new Error('Failed to fetch details');
          }
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data as PlaceDetails;
      } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
      }
    },
    enabled: isExpanded,
    retry: 1,
  });

  const placeData = details?.data?.[0]?.[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{place.name}</span>
          <div className="flex items-center gap-2">
            {place.rating && (
              <span className="flex items-center text-sm bg-yellow-100 px-2 py-1 rounded">
                <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                {place.rating}
                {place.reviews_count && (
                  <span className="text-gray-500 ml-1">({place.reviews_count})</span>
                )}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSelect?.(place)}
              className="h-8 w-8"
            >
              {isSelected ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <Square className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className={`space-y-2 ${!isExpanded ? "line-clamp-2" : ""}`}>
          {place.address && (
            <p className="text-sm text-gray-500">
              <MapPin className="inline-block h-4 w-4 mr-2" />
              {place.address}
            </p>
          )}
          {placeData?.phone && (
            <p className="text-sm">
              <Phone className="inline-block h-4 w-4 mr-2" />
              {placeData.phone}
            </p>
          )}
          {placeData?.site && (
            <a
              href={placeData.site}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline block"
            >
              <Globe className="inline-block h-4 w-4 mr-2" />
              Visit Website
            </a>
          )}

          {isExpanded && (
            <div className="space-y-2 mt-4">
              {isLoadingDetails ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : placeData ? (
                <PlaceDetails placeData={placeData} />
              ) : null}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2"
        >
          <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          {isExpanded ? "Show Less" : "View More"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;