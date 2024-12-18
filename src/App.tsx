import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ChatSettingsProvider } from "./contexts/ChatSettingsContext";
import Index from "./pages/Index";
import DocumentSearch from "./pages/DocumentSearch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ChatSettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/document-search" element={<DocumentSearch />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ChatSettingsProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;