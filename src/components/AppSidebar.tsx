import { Search, MessageSquare, Grid } from "lucide-react";
import SearchForm from "./SearchForm";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Draggable from "react-draggable";
import { toast } from "sonner";
import { searchPlaces } from "@/services/placesApi";

interface AppSidebarProps {
  onSearch: (query: string, location: string) => void;
  isLoading: boolean;
}

export function AppSidebar({ onSearch, isLoading }: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [bounds, setBounds] = useState({ top: 0, bottom: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateBounds = () => {
      const windowHeight = window.innerHeight;
      setBounds({
        top: 0,
        bottom: windowHeight - 64 // This ensures the icon stays within the bottom border
      });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const toggleSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const toggleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSearch(!showSearch);
  };

  const handleSearch = async (query: string, location: string) => {
    try {
      console.log("Searching for:", { brand: query, location });
      const results = await searchPlaces({ 
        brand: query, 
        location, 
        limit: 5 
      });
      
      if (results && results.length > 0) {
        onSearch(query, location);
        toast.success("Search completed successfully!");
      } else {
        toast.warning("No results found");
      }
    } catch (err) {
      console.error("Places API Error:", err);
      toast.error("Failed to fetch data from API");
    }
  };

  return (
    <Draggable 
      bounds={bounds}
      axis="y"
      position={position}
      onDrag={(e, data) => setPosition({ x: 0, y: data.y })}
      handle=".drag-handle"
    >
      <div 
        className={cn(
          "fixed right-4 z-50 transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-12",
          "bg-white rounded-lg shadow-lg"
        )}
        style={{ 
          top: 0,
        }}
      >
        <div 
          className="drag-handle cursor-move"
          onClick={toggleSidebar}
        >
          <div className={cn(
            "w-full flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-all duration-300",
          )}>
            <Grid className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {isExpanded && (
          <div className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
                  onClick={toggleSearch}
                >
                  <Search className="w-6 h-6" />
                  <span className="text-sm font-medium">Look for listings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-sm font-medium">Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {showSearch && (
              <div className="p-4 border-t">
                <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              </div>
            )}
          </div>
        )}
      </div>
    </Draggable>
  );
}