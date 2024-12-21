import { Clock, Info, Users } from "lucide-react";
import type { Place } from "@/types/place";
import BusinessHours from "./BusinessHours";

interface PlaceDetailsProps {
  place: Place;
}

const PlaceDetails = ({ place }: PlaceDetailsProps) => {
  const workingHours = place.Hours 
    ? Object.entries(place.Hours).map(([day, hours]) => `${day}: ${hours}`) 
    : [];

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
      {place["Brand Images"] && place["Brand Images"].length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {place["Brand Images"].map((image, index) => (
            image !== 'N/A' && (
              <img
                key={index}
                src={image}
                alt={`${place["Business Name"]} image ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;