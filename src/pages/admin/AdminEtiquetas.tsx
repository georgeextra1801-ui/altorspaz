import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Plus, Trash2 } from "lucide-react";

interface Label {
  id: string;
  recipient: string;
  address: string;
  city: string;
  phone: string;
  order_number: string;
}

const empty: Omit<Label, "id"> = {
  recipient: "",
  address: "",
  city: "",
  phone: "",
  order_number: "",
};

export default function AdminEtiquetas() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [form, setForm] = useState<Omit<Label, "id">>(empty);

  const add = () => {
    if (!form.recipient || !form.address) {
      return alert("Destinatario y dirección obligatorios");
    }
    setLabels((l) => [...l, { ...form, id: crypto.randomUUID() }]);
    setForm(empty);
  };

  const remove = (id: string) => setLabels((l) => l.filter((x) => x.id !== id));

  const print = () => window.print();

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-display tracking-wide">Etiquetas de envío</h1>
          <p className="text-muted-foreground text-sm">Formato 4x6 pulgadas para impresión térmica.</p>
        </div>
        <Button onClick={print} disabled={labels.length === 0}>
          <Printer className="h-4 w-4 mr-1" /> Imprimir ({labels.length})
        </Button>
      </div>

      <Card className="p-4 mb-6 print:hidden">
        <h2 className="font-medium mb-3">Agregar etiqueta</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Destinatario</Label><Input value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} /></div>
          <div><Label>N° pedido</Label><Input value={form.order_number} onChange={(e) => setForm({ ...form, order_number: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Dirección</Label><Textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div><Label>Ciudad</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        </div>
        <Button onClick={add} className="mt-3">
          <Plus className="h-4 w-4 mr-1" /> Agregar
        </Button>
      </Card>

      <div className="grid gap-4 print:gap-0">
        {labels.map((l) => (
          <div
            key={l.id}
            className="border-2 border-black p-4 bg-white text-black break-inside-avoid relative"
            style={{ width: "4in", height: "6in", fontFamily: "'Lucida Console', monospace" }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-1 right-1 print:hidden"
              onClick={() => remove(l.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="border-b-2 border-black pb-2 mb-2">
              <p className="text-xs font-bold">DE: SPAZ ALTOR</p>
              <p className="text-[10px]">pedidos@spazaltor.com.co</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold">PARA:</p>
              <p className="text-base font-black uppercase leading-tight">{l.recipient}</p>
              <p className="text-xs font-bold uppercase leading-tight whitespace-pre-wrap">{l.address}</p>
              <p className="text-xs font-bold uppercase">{l.city}</p>
              <p className="text-xs font-bold">TEL: {l.phone}</p>
            </div>
            {l.order_number && (
              <div className="mt-3 border-t-2 border-black pt-2">
                <p className="text-xs font-bold">PEDIDO: {l.order_number}</p>
              </div>
            )}
          </div>
        ))}
        {labels.length === 0 && (
          <p className="text-muted-foreground print:hidden">Agrega etiquetas para imprimir.</p>
        )}
      </div>
    </div>
  );
}
