import { useState } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import PlaceCard from "@/components/PlaceCard";
import SearchForm from "@/components/SearchForm";
import { searchPlaces, type Place } from "@/services/placesApi";

const Index = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async (brand: string, location: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsOpen(true);
    window.parent.postMessage({ 
      type: 'MODAL_OPEN',
      data: {
        brand,
        location,
      }
    }, '*');
    
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

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      window.parent.postMessage({ type: 'MODAL_CLOSE' }, '*');
    }
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center">
      <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Ummah Directory - AI</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-8 w-8" />
            <span>Search Listings</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => window.location.href = '/admin/together'}
          >
            <MessageSquare className="h-8 w-8" />
            <span>Chat</span>
          </Button>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Search Listings</h2>
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Search Results</h2>
            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            )}
            {!isLoading && places.map((place, index) => (
              <PlaceCard 
                key={index}
                place={place}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;