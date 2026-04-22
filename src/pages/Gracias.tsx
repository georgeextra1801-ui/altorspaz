import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package } from "lucide-react";

interface OrderSnapshot {
  items: Array<{ title: string; variantTitle: string; quantity: number; price: string; currencyCode: string }>;
  total: number;
  customer?: { nombre?: string; email?: string };
  capturedAt?: string;
}

export default function Gracias() {
  const [params] = useSearchParams();
  const [snap, setSnap] = useState<OrderSnapshot | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("checkout_snapshot");
      if (raw) setSnap(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const orderRef = params.get("order") || params.get("checkout_token");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle2 className="h-20 w-20 text-spaz-green mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl mb-2">¡GRACIAS POR TU COMPRA!</h1>
          <p className="text-muted-foreground">
            Tu pedido fue recibido correctamente. Te enviaremos un correo con los detalles.
          </p>
          {orderRef && (
            <p className="text-sm mt-2 font-mono text-muted-foreground">Ref: {orderRef}</p>
          )}
        </div>

        {snap && (
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 font-display text-xl">
                <Package className="h-5 w-5" /> Resumen del pedido
              </div>
              {snap.items?.map((it, i) => (
                <div key={i} className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">{it.title}</p>
                    <p className="text-muted-foreground">{it.variantTitle} × {it.quantity}</p>
                  </div>
                  <p className="font-semibold">{it.currencyCode} {parseFloat(it.price).toFixed(0)}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>${snap.total?.toFixed(0)} COP</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">Seguir comprando</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/perfil">Ver mis pedidos</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
