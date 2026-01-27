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
  // Remove Lovable badge aggressively
  useEffect(() => {
    const removeLovable = () => {
      // Remove by ID
      const badge = document.getElementById('lovable-badge');
      if (badge) badge.remove();
      
      // Remove by class
      document.querySelectorAll('[class*="lovable"]').forEach(el => el.remove());
      
      // Remove by text content
      document.querySelectorAll('*').forEach(el => {
        if (el.textContent?.includes('Edit with') && el.textContent?.includes('Lovable')) {
          el.remove();
        }
      });
    };
    
    // Run multiple times to catch dynamic injection
    removeLovable();
    setTimeout(removeLovable, 500);
    setTimeout(removeLovable, 1000);
    setTimeout(removeLovable, 2000);
    
    // Also run on any DOM changes
    const observer = new MutationObserver(removeLovable);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
