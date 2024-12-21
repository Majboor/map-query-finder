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
import { useState } from "react";
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

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!showSearch) {
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setIsExpanded(true);
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
      bounds={{ left: 0, right: 236 }}
      axis="x"
    >
      <div 
        className={cn(
          "fixed left-0 z-50 transition-all duration-300 ease-in-out cursor-move",
          isExpanded ? "w-64" : "w-16",
          "bg-white rounded-lg shadow-lg"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100",
                  isExpanded ? "justify-start" : "justify-start px-4"
                )}
              >
                <Grid className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium">AI</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isExpanded && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={toggleSearch}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <Search className="w-6 h-6" />
                    <span className="text-sm font-medium">Look for listings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-sm font-medium">Chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </div>

        {showSearch && (
          <div className="p-4 border-t">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        )}
      </div>
    </Draggable>
  );
}