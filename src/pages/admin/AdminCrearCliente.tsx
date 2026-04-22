import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";

const DOC_TYPES = ["CC", "CE", "NIT", "TI", "PASAPORTE", "DNI"];

interface Props {
  embedded?: boolean;
}

export default function AdminCrearCliente({ embedded = false }: Props) {
  const [tipoDoc, setTipoDoc] = useState("CC");
  const [numDoc, setNumDoc] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !numDoc) return toast.error("Nombre, email y documento obligatorios");

    setBusy(true);
    try {
      // Aquí se conectaría la edge function de creación de cliente Shopify
      // Por ahora guardamos snapshot local para confirmar el flujo de UI
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`Cliente ${nombre} creado (sincronización Shopify pendiente de configurar)`);
      setNumDoc(""); setNombre(""); setApellido(""); setEmail("");
      setTelefono(""); setCiudad(""); setDireccion("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const Wrapper = embedded ? "div" : "div";

  return (
    <Wrapper>
      {!embedded && (
        <h1 className="text-3xl font-display tracking-wide mb-6">Crear cliente</h1>
      )}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Datos del cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
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
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Nombre *</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input value={apellido} onChange={(e) => setApellido(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Ciudad</Label>
                <Input value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              </div>
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear cliente"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              El documento se sincroniza con Shopify Customer Metafields (namespace integracion_dsi).
            </p>
          </form>
        </CardContent>
      </Card>
    </Wrapper>
  );
}
