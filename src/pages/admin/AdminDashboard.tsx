import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Image as ImageIcon, Megaphone } from "lucide-react";

const sections = [
  { title: "Usuarios", desc: "Gestiona roles y permisos.", to: "/admin/usuarios", icon: Users },
  { title: "Banners Home", desc: "Carrusel principal.", to: "/admin/banners", icon: ImageIcon },
  { title: "Campañas", desc: "Landings de campaña.", to: "/admin/campanas", icon: Megaphone },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-display tracking-wide mb-6">Panel de administración</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.to} to={s.to}>
            <Card className="hover:border-primary transition-colors h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <s.icon className="h-6 w-6 text-primary" />
                <CardTitle className="font-display tracking-wide text-lg">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
