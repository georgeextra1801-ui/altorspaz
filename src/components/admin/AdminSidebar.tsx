import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Image as ImageIcon, Megaphone, LogOut } from "lucide-react";
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

const items = [
  { title: "Inicio", url: "/admin", icon: LayoutDashboard },
  { title: "Usuarios", url: "/admin/usuarios", icon: Users },
  { title: "Banners Home", url: "/admin/banners", icon: ImageIcon },
  { title: "Campañas", url: "/admin/campanas", icon: Megaphone },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
