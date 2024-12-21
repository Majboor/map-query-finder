import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import PlaceCard from "@/components/PlaceCard";
import { Button } from "@/components/ui/button";
import { searchPlaces, type Place } from "@/services/placesApi";
import { Loader2, X } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

const Index = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentBrand, setCurrentBrand] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (brand: string, location: string) => {
    setIsLoading(true);
    setCurrentBrand(brand);
    setCurrentLocation(location);
    try {
      const results = await searchPlaces({ brand, location });
      setPlaces(results);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
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
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-50">
        <div className="fixed right-0 top-0 bottom-0 z-50">
          <AppSidebar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto fixed right-[320px] top-1/2 -translate-y-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {isLoading && places.length === 0 && (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            )}

            {places.length > 0 && (
              <div className="space-y-6">
                {places.map((place, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <PlaceCard
                      place={place}
                      isSelected={selectedPlaces.has(place["Business Name"])}
                    />
                    <Button 
                      onClick={() => handleSelect(place)}
                      className="w-full"
                    >
                      Select This Location
                    </Button>
                  </div>
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
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Index;