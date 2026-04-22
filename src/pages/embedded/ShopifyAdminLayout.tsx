import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Layout para vistas embebidas dentro del admin de Shopify.
 * Oculta header/footer global y solo muestra el contenido para iframe.
 */
export default function ShopifyAdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
  }
  if (!user) return <Navigate to="/auth?redirect=/shopify-admin/notas-pedido" replace />;
  if (!isAdmin) return <Navigate to="/auth?error=forbidden" replace />;

  return (
    <div className="min-h-screen bg-background p-4">
      <Outlet />
    </div>
  );
}
