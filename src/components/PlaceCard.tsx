import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Phone, Globe } from "lucide-react";
import type { Place } from "@/services/placesApi";

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{place.name}</span>
          {place.rating && (
            <span className="flex items-center text-sm bg-yellow-100 px-2 py-1 rounded">
              <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
              {place.rating}
              {place.reviews_count && (
                <span className="text-gray-500 ml-1">({place.reviews_count})</span>
              )}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
      </CardContent>
    </Card>
  );
};

export default PlaceCard;