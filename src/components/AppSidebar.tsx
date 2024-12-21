import { Search, MessageSquare, Grid } from "lucide-react";
import SearchForm from "./SearchForm";
import {
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
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
  const [bounds, setBounds] = useState({ right: 0, left: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateBounds = () => {
      const windowWidth = window.innerWidth;
      setBounds({
        right: windowWidth - 64,
        left: windowWidth - 256
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
      bounds={{ left: bounds.left, right: bounds.right }}
      axis="x"
      position={position}
      onDrag={(e, data) => setPosition({ x: data.x, y: 0 })}
      handle=".drag-handle"
    >
      <div 
        className={cn(
          "fixed top-0 z-50 h-screen transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-16",
          "bg-white rounded-l-lg shadow-lg"
        )}
        style={{ 
          right: `${-position.x}px`,
        }}
      >
        <div 
          className="drag-handle cursor-move p-2"
          onClick={toggleSidebar}
        >
          <div className={cn(
            "w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-all duration-300",
            isExpanded ? "justify-start" : "justify-center"
          )}>
            <Grid className="w-6 h-6 text-blue-500" />
            {isExpanded && (
              <span className="text-sm font-medium">AI</span>
            )}
          </div>
        </div>

        {isExpanded && (
          <>
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
            </div>

            {showSearch && (
              <div className="p-4 border-t">
                <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              </div>
            )}
          </>
        )}
      </div>
    </Draggable>
  );
}