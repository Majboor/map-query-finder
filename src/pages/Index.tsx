import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import PlaceCard from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { searchPlaces, type Place } from "@/services/placesApi";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const handleSearch = async (query: string, location: string) => {
    setIsLoading(true);
    setCurrentQuery(query);
    setCurrentLocation(location);
    const results = await searchPlaces({ query, location });
    setPlaces(results);
    setIsLoading(false);
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    const newResults = await searchPlaces({
      query: currentQuery,
      location: currentLocation,
      skipPlaces: places.length,
      limit: 1,
    });
    setPlaces([...places, ...newResults]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Place Search
        </h1>
        
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && places.length === 0 && (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}

        {places.length > 0 && (
          <div className="space-y-6">
            {places.map((place, index) => (
              <PlaceCard key={index} place={place} />
            ))}
            
            <div className="flex justify-center">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;