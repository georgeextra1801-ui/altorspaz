import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";

interface Annotation {
  id: string;
  shopify_order_id: string;
  comment: string | null;
  shipping_cost: number | null;
  updated_at: string;
}

export default function AdminPedidos() {
  const [list, setList] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Annotation> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("order_annotations")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList((data ?? []) as Annotation[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.shopify_order_id) {
      toast.error("ID de pedido obligatorio");
      return;
    }
    const payload: any = {
      shopify_order_id: editing.shopify_order_id,
      comment: editing.comment ?? null,
      shipping_cost: editing.shipping_cost ?? 0,
    };
    let error;
    if ((editing as Annotation).id) {
      ({ error } = await supabase.from("order_annotations").update(payload).eq("id", (editing as Annotation).id));
    } else {
      ({ error } = await supabase.from("order_annotations").insert(payload));
    }
    if (error) return toast.error(error.message);
    toast.success("Anotación guardada");
    setOpen(false);
    setEditing(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display tracking-wide">Pedidos</h1>
          <p className="text-muted-foreground text-sm">Anotaciones internas y costos de envío por pedido Shopify.</p>
        </div>
        <Button onClick={() => { setEditing({ shopify_order_id: "", comment: "", shipping_cost: 0 }); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Nueva anotación
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : (
        <Card className="divide-y">
          {list.map((a) => (
            <div key={a.id} className="p-3 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Pedido #{a.shopify_order_id}</p>
                <p className="text-xs text-muted-foreground truncate">{a.comment ?? "Sin comentarios"}</p>
              </div>
              {a.shipping_cost ? (
                <Badge variant="outline">Envío: ${Number(a.shipping_cost).toLocaleString()}</Badge>
              ) : null}
              <Button variant="ghost" size="sm" onClick={() => { setEditing(a); setOpen(true); }}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {list.length === 0 && <p className="p-4 text-muted-foreground">No hay anotaciones todavía.</p>}
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{(editing as Annotation)?.id ? "Editar" : "Nueva"} anotación</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div>
                <Label>ID pedido Shopify</Label>
                <Input value={editing.shopify_order_id ?? ""} onChange={(e) => setEditing({ ...editing, shopify_order_id: e.target.value })} />
              </div>
              <div>
                <Label>Costo de envío</Label>
                <Input type="number" value={editing.shipping_cost ?? 0} onChange={(e) => setEditing({ ...editing, shipping_cost: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Comentario</Label>
                <Textarea rows={4} value={editing.comment ?? ""} onChange={(e) => setEditing({ ...editing, comment: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
