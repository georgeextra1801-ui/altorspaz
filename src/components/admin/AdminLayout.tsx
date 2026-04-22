import { Outlet, Navigate, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import altorLogo from "@/assets/altor-logo.png";

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-display">Sin permisos</h1>
        <p className="text-muted-foreground text-center">
          Tu cuenta no tiene rol de administrador.
        </p>
        <Link to="/" className="text-primary underline">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 gap-4 bg-card">
            <SidebarTrigger />
            <Link to="/" className="flex items-center">
              <img src={altorLogo} alt="Altor" className="h-8 w-auto" />
            </Link>
            <span className="font-display tracking-wide text-sm text-muted-foreground">Panel admin</span>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
