import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import PlaceCard from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { searchPlaces, type Place } from "@/services/placesApi";
import { Loader2, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

const Index = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBrand, setCurrentBrand] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (brand: string, location: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsOpen(true);
    setCurrentBrand(brand);
    setCurrentLocation(location);
    
    try {
      const results = await searchPlaces({ brand, location });
      setPlaces(results);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch results");
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newResults = await searchPlaces({
        brand: currentBrand,
        location: currentLocation,
        limit: places.length + 5,
      });
      setPlaces(newResults);
    } catch (error) {
      console.error("Load more error:", error);
      toast.error("Failed to load more results");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (place: Place) => {
    try {
      window.parent.postMessage({
        type: 'PLACE_SELECTED',
        data: place
      }, '*');
      
      toast.success("Location details sent successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error sending data to parent:", error);
      toast.error("Failed to send location details");
    }
  };

  return (
    <div className="h-screen w-full bg-background">
      <AppSidebar onSearch={handleSearch} isLoading={isLoading} />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] md:w-full md:max-w-3xl max-h-[80vh] md:max-h-[85vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Search Results</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-4 animate-spin text-gray-500" />
            </div>
          )}

          {!isLoading && places.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No results found
            </div>
          )}

          {!isLoading && places.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {places.map((place, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <PlaceCard
                    place={place}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
              
              <div className="flex justify-center pt-2">
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;