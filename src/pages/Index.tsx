import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import PlaceCard from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { searchPlaces, type Place } from "@/services/placesApi";
import { Loader2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
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

  const handleSelect = (place: Place) => {
    setSelectedPlaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(place.name)) {
        newSet.delete(place.name);
      } else {
        newSet.add(place.name);
      }
      return newSet;
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50 relative">
        <AppSidebar onSearch={handleSearch} isLoading={isLoading} />
        
        <main className="flex-1 p-8">
          {isLoading && places.length === 0 && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}

          {places.length > 0 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {places.map((place, index) => (
                <PlaceCard
                  key={index}
                  place={place}
                  onSelect={handleSelect}
                  isSelected={selectedPlaces.has(place.name)}
                />
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;