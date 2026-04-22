import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Image as ImageIcon,
  Megaphone,
  Package,
  Calculator,
  ClipboardList,
  Tag,
  QrCode,
} from "lucide-react";

const sections = [
  { title: "Usuarios", desc: "Gestiona roles y permisos.", to: "/admin/usuarios", icon: Users },
  { title: "Banners Home", desc: "Carrusel principal de la tienda.", to: "/admin/banners", icon: ImageIcon },
  { title: "Campañas", desc: "Landings de campaña dinámicas.", to: "/admin/campanas", icon: Megaphone },
  { title: "Pedidos", desc: "Anotaciones y costos de envío.", to: "/admin/pedidos", icon: ClipboardList },
  { title: "Etiquetas", desc: "Etiquetas de envío 4x6.", to: "/admin/etiquetas", icon: Tag },
  { title: "QR", desc: "Biblioteca de códigos QR.", to: "/admin/qr", icon: QrCode },
  { title: "Bodega", desc: "Inventario, kardex y movimientos.", to: "/admin/bodega", icon: Package },
  { title: "Contabilidad", desc: "Ventas, egresos, recibos y conciliaciones.", to: "/admin/contabilidad", icon: Calculator },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-display tracking-wide mb-2">Panel de administración</h1>
      <p className="text-muted-foreground mb-6">Spaz Altor — gestión completa de la tienda.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
