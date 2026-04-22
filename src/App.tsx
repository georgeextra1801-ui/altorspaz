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
import ResetPassword from "./pages/ResetPassword";
import Perfil from "./pages/Perfil";
import Checkout from "./pages/Checkout";
import Gracias from "./pages/Gracias";
import SobreNosotros from "./pages/SobreNosotros";
import Envios from "./pages/Envios";
import Devoluciones from "./pages/Devoluciones";
import GuiaTallas from "./pages/GuiaTallas";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import CampaignLanding from "./pages/CampaignLanding";
import PedidosStandalone from "./pages/PedidosStandalone";
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
import AdminCarrusel from "./pages/admin/AdminCarrusel";
import AdminInventario from "./pages/admin/AdminInventario";
import AdminCrearCliente from "./pages/admin/AdminCrearCliente";
import AdminTags from "./pages/admin/AdminTags";
import ShopifyAdminLayout from "./pages/embedded/ShopifyAdminLayout";
import ShopifyNotasPedido from "./pages/embedded/ShopifyNotasPedido";
import ShopifyCrearCliente from "./pages/embedded/ShopifyCrearCliente";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/gracias" element={<Gracias />} />
        <Route path="/producto/:handle" element={<ProductPage />} />
        <Route path="/probador-virtual" element={<VirtualTryOnPage />} />
        <Route path="/mujeres" element={<MujeresPage />} />
        <Route path="/hombres" element={<HombresPage />} />
        <Route path="/ninos" element={<NinosPage />} />
        <Route path="/ofertas" element={<OfertasPage />} />
        <Route path="/busqueda" element={<SearchPage />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/envios" element={<Envios />} />
        <Route path="/devoluciones" element={<Devoluciones />} />
        <Route path="/guia-tallas" element={<GuiaTallas />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/campanas/:slug" element={<CampaignLanding />} />
        <Route path="/pedidos" element={<PedidosStandalone />} />

        <Route path="/shopify-admin" element={<ShopifyAdminLayout />}>
          <Route path="notas-pedido" element={<ShopifyNotasPedido />} />
          <Route path="crear-cliente" element={<ShopifyCrearCliente />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="carrusel" element={<AdminCarrusel />} />
          <Route path="campanas" element={<AdminCampaigns />} />
          <Route path="bodega" element={<AdminBodega />} />
          <Route path="inventario" element={<AdminInventario />} />
          <Route path="contabilidad" element={<AdminContabilidad />} />
          <Route path="pedidos" element={<AdminPedidos />} />
          <Route path="crear-cliente" element={<AdminCrearCliente />} />
          <Route path="etiquetas" element={<AdminEtiquetas />} />
          <Route path="tags" element={<AdminTags />} />
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
