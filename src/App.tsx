import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Remove Lovable badge - MOVED INSIDE THE COMPONENT
  useEffect(() => {
    const removeLovableBadge = () => {
      const badge = document.getElementById('lovable-badge');
      if (badge) {
        badge.remove();
      }
      // Also try removing by class or any element containing "lovable"
      document.querySelectorAll('[id*="lovable"], [class*="lovable"]').forEach(el => el.remove());
    };
    
    // Run immediately
    removeLovableBadge();
    
    // Run again after a delay to catch dynamically added elements
    setTimeout(removeLovableBadge, 1000);
    setTimeout(removeLovableBadge, 3000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
