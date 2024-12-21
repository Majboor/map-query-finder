import { Clock, Info, Users } from "lucide-react";
import { useState, useEffect } from "react";
import type { Place } from "@/types/place";
import BusinessHours from "./BusinessHours";

interface PlaceDetailsProps {
  place: Place;
}

const PlaceDetails = ({ place }: PlaceDetailsProps) => {
  const [validImages, setValidImages] = useState<string[]>([]);
  const workingHours = place.Hours 
    ? Object.entries(place.Hours).map(([day, hours]) => `${day}: ${hours}`) 
    : [];

  useEffect(() => {
    const checkImages = async () => {
      const validImgs = [];
      for (const image of place["Brand Images"]) {
        if (!image || image === 'N/A') continue;
        try {
          const response = await fetch(image);
          if (response.ok && response.status !== 404) {
            const contentType = response.headers.get('content-type');
            if (contentType?.startsWith('image/')) {
              validImgs.push(image);
            }
          }
        } catch (error) {
          console.error("Error checking image:", error);
        }
      }
      setValidImages(validImgs);
    };

    if (place["Brand Images"]?.length) {
      checkImages();
    }
  }, [place]);

  return (
    <div className="space-y-2">
      {place["Business Description"] && (
        <p className="text-sm">
          <Info className="inline-block h-4 w-4 mr-2" />
          Description: {place["Business Description"]}
        </p>
      )}
      {workingHours.length > 0 && (
        <div>
          <Clock className="inline-block h-4 w-4 mr-2" />
          <span className="font-medium">Business Hours:</span>
          <BusinessHours hours={workingHours} />
        </div>
      )}
      {validImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {validImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${place["Business Name"]} image ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;