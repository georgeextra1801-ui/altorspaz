import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import VirtualTryOnPage from "./pages/VirtualTryOnPage";
import { MujeresPage, HombresPage, NinosPage, OfertasPage } from "./pages/CategoryPages";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import CampaignLanding from "./pages/CampaignLanding";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminBodega from "./pages/admin/AdminBodega";
import AdminContabilidad from "./pages/admin/AdminContabilidad";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminEtiquetas from "./pages/admin/AdminEtiquetas";
import AdminQR from "./pages/admin/AdminQR";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/producto/:handle" element={<ProductPage />} />
        <Route path="/probador-virtual" element={<VirtualTryOnPage />} />
        <Route path="/mujeres" element={<MujeresPage />} />
        <Route path="/hombres" element={<HombresPage />} />
        <Route path="/ninos" element={<NinosPage />} />
        <Route path="/ofertas" element={<OfertasPage />} />
        <Route path="/busqueda" element={<SearchPage />} />
        <Route path="/campanas/:slug" element={<CampaignLanding />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="campanas" element={<AdminCampaigns />} />
          <Route path="bodega" element={<AdminBodega />} />
          <Route path="contabilidad" element={<AdminContabilidad />} />
          <Route path="pedidos" element={<AdminPedidos />} />
          <Route path="etiquetas" element={<AdminEtiquetas />} />
          <Route path="qr" element={<AdminQR />} />
        </Route>

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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
