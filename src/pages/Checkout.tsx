import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DOC_TYPES = ["CC", "CE", "NIT", "TI", "PASAPORTE", "DNI"];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCheckoutUrl, isLoading } = useCartStore();
  const [tipoDoc, setTipoDoc] = useState("CC");
  const [numDoc, setNumDoc] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [busy, setBusy] = useState(false);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);

  const proceed = async () => {
    if (!numDoc.trim()) return toast.error("Número de documento obligatorio");
    if (!nombre.trim() || !email.trim()) return toast.error("Nombre y email obligatorios");

    setBusy(true);
    try {
      // Snapshot para /gracias
      sessionStorage.setItem(
        "checkout_snapshot",
        JSON.stringify({
          items: items.map((i) => ({
            title: i.product.node.title,
            variantTitle: i.variantTitle,
            quantity: i.quantity,
            price: i.price.amount,
            currencyCode: i.price.currencyCode,
          })),
          total,
          customer: { nombre, email },
          capturedAt: new Date().toISOString(),
        })
      );

      const url = getCheckoutUrl();
      if (!url) {
        toast.error("No hay URL de checkout activa");
        setBusy(false);
        return;
      }
      // Redirige al checkout nativo de Shopify/Bold (top frame)
      window.open(url, "_top");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al procesar");
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl mb-4">Tu carrito está vacío</h1>
          <Button onClick={() => navigate("/")}>Seguir comprando</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-display tracking-wide">Datos de facturación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Tipo doc *</Label>
                <Select value={tipoDoc} onValueChange={setTipoDoc}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Número *</Label>
                <Input value={numDoc} onChange={(e) => setNumDoc(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label>Nombre completo *</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div>
              <Label>Ciudad</Label>
              <Input value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            </div>
            <Button onClick={proceed} disabled={busy || isLoading} className="w-full" size="lg">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pagar con Bold / Shopify"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Serás redirigido al portal de pago seguro.
            </p>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="font-display tracking-wide">Resumen ({totalItems} items)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((it) => (
              <div key={it.variantId} className="flex gap-3 border-b pb-3">
                {it.product.node.images.edges[0] && (
                  <img
                    src={it.product.node.images.edges[0].node.url}
                    alt={it.product.node.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{it.product.node.title}</p>
                  <p className="text-muted-foreground">{it.variantTitle} × {it.quantity}</p>
                </div>
                <p className="font-semibold text-sm">
                  {it.price.currencyCode} {(parseFloat(it.price.amount) * it.quantity).toFixed(0)}
                </p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>${total.toFixed(0)} COP</span>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
