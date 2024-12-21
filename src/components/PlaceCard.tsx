import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Globe, ChevronDown, CheckSquare, Square } from "lucide-react";
import type { Place } from "@/types/place";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import PlaceDetailsComponent from "./PlaceDetails";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PlaceCardProps {
  place: Place;
  onSelect?: (place: Place) => void;
  isSelected?: boolean;
}

const PlaceCard = ({ place, onSelect, isSelected = false }: PlaceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [validImage, setValidImage] = useState<string | null>(null);

  useEffect(() => {
    const checkImage = async (url: string) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          setValidImage(url);
        } else {
          console.log(`Image validation failed for ${url}: ${response.status}`);
          setValidImage(null);
        }
      } catch (error) {
        console.error("Error checking image:", error);
        setValidImage(null);
      }
    };

    const validateFirstImage = async () => {
      if (place["Brand Images"]?.[0] && place["Brand Images"][0] !== 'N/A') {
        await checkImage(place["Brand Images"][0]);
      } else {
        setValidImage(null);
      }
    };

    validateFirstImage();
  }, [place]);

  const handleSelect = () => {
    if (onSelect) {
      try {
        onSelect(place);
      } catch (error) {
        console.error("Error in select handler:", error);
      }
    }
  };

  // Filter out the validImage from Brand Images before passing to PlaceDetails
  const filteredPlace = {
    ...place,
    "Brand Images": place["Brand Images"].filter(img => img !== validImage && img !== 'N/A')
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {validImage ? (
                <AvatarImage src={validImage} alt={place["Business Name"]} />
              ) : (
                <AvatarFallback>{place["Business Name"].charAt(0).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <span>{place["Business Name"]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSelect}
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
          {place["Business Address"] && (
            <p className="text-sm text-gray-500">
              <MapPin className="inline-block h-4 w-4 mr-2" />
              {place["Business Address"]}
            </p>
          )}
          {place["Business Phone"] && (
            <p className="text-sm">
              <Phone className="inline-block h-4 w-4 mr-2" />
              {place["Business Phone"]}
            </p>
          )}
          {place["Website URL"] && (
            <a
              href={place["Website URL"]}
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
              <PlaceDetailsComponent place={filteredPlace} />
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