import { Search } from "lucide-react";
import SearchForm from "./SearchForm";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onSearch: (query: string, location: string) => void;
  isLoading: boolean;
}

export function AppSidebar({ onSearch, isLoading }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Search className="w-5 h-5" />
          Place Search
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Search Places</SidebarGroupLabel>
          <div className="px-2">
            <SearchForm onSearch={onSearch} isLoading={isLoading} />
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}