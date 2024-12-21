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
import { reformatResponse } from "@/utils/responseMapper";

interface AppSidebarProps {
  onSearch: (query: string, location: string) => void;
  isLoading: boolean;
}

const DEFAULT_API_KEY = "YjE5YzI1NzQ0MTRjNGQwOWJmYzU3YzZmNmU5NDZiNTZ8N2Y5YWRkMjA2Ng";

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
      const params = new URLSearchParams({
        query: `${query} ${location}`,
        limit: "1",
        async: "false",
        language: "en",
        region: "AU",
        dropDuplicates: "true"
      });

      const response = await fetch(`https://api.app.outscraper.com/maps/search-v3?${params}`, {
        headers: {
          "X-API-KEY": DEFAULT_API_KEY,
        },
      });

      switch (response.status) {
        case 200:
          const data = await response.json();
          console.log("Original API Response:", data);
          
          if (data.status === "Success" && data.data) {
            const reformattedData = reformatResponse(data);
            console.log("Reformatted Response:", reformattedData);
            onSearch(query, location);
            toast.success("Search completed successfully!");
          } else {
            throw new Error("Invalid response format from API");
          }
          break;
          
        case 202:
          toast.info("Async request initiated - results will be available later");
          break;
          
        case 204:
          toast.warning("No results found");
          break;
          
        case 401:
          toast.error("Invalid API Key");
          break;
          
        case 402:
          toast.error("Payment required - Check your API subscription");
          break;
          
        case 422:
          toast.error("Invalid query parameters");
          break;
          
        default:
          throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Failed to fetch data from API");
    }
  };

  return (
    <Draggable bounds="parent">
      <div 
        className={cn(
          "fixed z-50 transition-all duration-300 ease-in-out cursor-move",
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
                  isExpanded ? "justify-start" : "justify-center"
                )}
              >
                <Grid className="w-6 h-6 text-blue-500" />
                {isExpanded && <span className="text-sm font-medium">AI</span>}
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