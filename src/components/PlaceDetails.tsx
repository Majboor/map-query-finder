import { Clock, Info, DollarSign, Users, Star } from "lucide-react";
import type { PlaceData } from "@/types/place";
import BusinessHours from "./BusinessHours";

interface PlaceDetailsProps {
  placeData: PlaceData;
}

const PlaceDetails = ({ placeData }: PlaceDetailsProps) => {
  const workingHours = placeData?.working_hours 
    ? Object.entries(placeData.working_hours).map(([day, hours]) => `${day}: ${hours}`) 
    : [];

  return (
    <div className="space-y-2">
      {placeData.business_status && (
        <p className="text-sm">
          <Info className="inline-block h-4 w-4 mr-2" />
          Status: {placeData.business_status}
        </p>
      )}
      {placeData.price_level && (
        <p className="text-sm">
          <DollarSign className="inline-block h-4 w-4 mr-2" />
          Price Level: {'$'.repeat(placeData.price_level)}
        </p>
      )}
      {workingHours.length > 0 && (
        <BusinessHours hours={workingHours} />
      )}
      {placeData.reviews && placeData.reviews.length > 0 && (
        <div className="text-sm mt-4">
          <Users className="inline-block h-4 w-4 mr-2" />
          <span className="font-medium">Recent Reviews:</span>
          <div className="ml-6 mt-2 space-y-3">
            {placeData.reviews.slice(0, 3).map((review, index) => (
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
    </div>
  );
};

export default PlaceDetails;