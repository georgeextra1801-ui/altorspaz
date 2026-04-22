import AdminPedidos from "@/pages/admin/AdminPedidos";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PedidosStandalone() {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
  if (!user) return <Navigate to="/auth?redirect=/pedidos" replace />;
  if (!isAdmin) return <Navigate to="/auth?error=forbidden" replace />;

  return (
    <div className="min-h-screen bg-background p-6">
      <AdminPedidos />
    </div>
  );
}
