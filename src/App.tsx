import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import VirtualTryOnPage from "./pages/VirtualTryOnPage";
import { MujeresPage, HombresPage, NinosPage, OfertasPage } from "./pages/CategoryPages";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/producto/:handle" element={<ProductPage />} />
        <Route path="/probador-virtual" element={<VirtualTryOnPage />} />
        <Route path="/mujeres" element={<MujeresPage />} />
        <Route path="/hombres" element={<HombresPage />} />
        <Route path="/ninos" element={<NinosPage />} />
        <Route path="/ofertas" element={<OfertasPage />} />
        <Route path="/busqueda" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
