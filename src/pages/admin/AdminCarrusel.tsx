import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Tag, ArrowRight } from "lucide-react";

export default function AdminCarrusel() {
  return (
    <div>
      <h1 className="text-3xl font-display tracking-wide mb-2">Carrusel de productos</h1>
      <p className="text-muted-foreground mb-6">
        El carrusel "PRINCIPALES" del home y la página /ofertas se sincronizan automáticamente
        con los productos que tengan el tag <code className="bg-muted px-1 rounded">carrusel_home</code> en Shopify.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" /> Cómo agregar productos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Abre el producto en el admin de Shopify.</li>
              <li>En la sección <strong>Tags</strong>, agrega <code className="bg-muted px-1 rounded">carrusel_home</code>.</li>
              <li>Guarda. Aparecerá automáticamente en el home.</li>
            </ol>
            <Button asChild variant="outline" className="w-full">
              <a href="https://admin.shopify.com" target="_blank" rel="noreferrer">
                Abrir Shopify Admin <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Banners del Hero
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Los banners principales del home se gestionan desde el panel de banners.
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/banners">Gestionar banners <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
