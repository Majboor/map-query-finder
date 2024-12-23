import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import Wrapper from "@/pages/Admin/Wrapper";
import Together from "@/pages/Admin/Together";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/wrapper" element={<Wrapper />} />
              <Route path="/admin/together" element={<Together />} />
            </Routes>
          </SidebarProvider>
        </Router>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;