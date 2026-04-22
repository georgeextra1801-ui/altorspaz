import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  Megaphone,
  LogOut,
  Package,
  Calculator,
  ClipboardList,
  Tag,
  QrCode,
  GalleryHorizontal,
  Boxes,
  UserPlus,
  Tags,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const groups: { label: string; items: { title: string; url: string; icon: any }[] }[] = [
  {
    label: "General",
    items: [
      { title: "Inicio", url: "/admin", icon: LayoutDashboard },
      { title: "Usuarios", url: "/admin/usuarios", icon: Users },
    ],
  },
  {
    label: "Tienda",
    items: [
      { title: "Banners Home", url: "/admin/banners", icon: ImageIcon },
      { title: "Carrusel", url: "/admin/carrusel", icon: GalleryHorizontal },
      { title: "Campañas", url: "/admin/campanas", icon: Megaphone },
      { title: "Tags", url: "/admin/tags", icon: Tags },
      { title: "Pedidos", url: "/admin/pedidos", icon: ClipboardList },
      { title: "Crear cliente", url: "/admin/crear-cliente", icon: UserPlus },
      { title: "Etiquetas envío", url: "/admin/etiquetas", icon: Tag },
      { title: "QR", url: "/admin/qr", icon: QrCode },
    ],
  },
  {
    label: "Operación",
    items: [
      { title: "Bodega", url: "/admin/bodega", icon: Package },
      { title: "Inventario", url: "/admin/inventario", icon: Boxes },
      { title: "Contabilidad", url: "/admin/contabilidad", icon: Calculator },
    ],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <NavLink to={item.url} end>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && "Cerrar sesión"}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
