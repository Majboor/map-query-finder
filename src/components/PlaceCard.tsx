import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Globe, ChevronDown, CheckSquare, Square, Clock, Info, DollarSign, Users } from "lucide-react";
import type { Place } from "@/services/placesApi";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/maps/search-v3?query=${encodeURIComponent(place.name)}&limit=1&async=false&fields=business_status,price_level,business_hours,reviews`, {
        headers: {
          'X-API-KEY': import.meta.env.VITE_API_KEY,
        },
      });
      if (!response.ok) {
        console.error('API Error:', response.status);
        throw new Error('Failed to fetch details');
      }
      const data = await response.json();
      console.log('API Response:', data);
      if (!data.data?.[0]?.[0]) {
        throw new Error('No details found');
      }
      return data.data[0][0];
    },
    enabled: isExpanded,
    retry: 1,
  });

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
          {place.phone && (
            <p className="text-sm">
              <Phone className="inline-block h-4 w-4 mr-2" />
              {place.phone}
            </p>
          )}
          {place.website && (
            <a
              href={place.website}
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
              ) : details ? (
                <>
                  {details.business_status && (
                    <p className="text-sm">
                      <Info className="inline-block h-4 w-4 mr-2" />
                      Status: {details.business_status}
                    </p>
                  )}
                  {details.price_level && (
                    <p className="text-sm">
                      <DollarSign className="inline-block h-4 w-4 mr-2" />
                      Price Level: {'$'.repeat(details.price_level)}
                    </p>
                  )}
                  {details.business_hours && (
                    <div className="text-sm">
                      <Clock className="inline-block h-4 w-4 mr-2" />
                      <span className="font-medium">Opening Hours:</span>
                      <ul className="ml-6 mt-1">
                        {details.business_hours.map((hour: string, index: number) => (
                          <li key={index}>{hour}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {details.reviews && details.reviews.length > 0 && (
                    <div className="text-sm mt-4">
                      <Users className="inline-block h-4 w-4 mr-2" />
                      <span className="font-medium">Recent Reviews:</span>
                      <div className="ml-6 mt-2 space-y-3">
                        {details.reviews.slice(0, 3).map((review: any, index: number) => (
                          <div key={index} className="border-l-2 border-gray-200 pl-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                              <span>{review.rating}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
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