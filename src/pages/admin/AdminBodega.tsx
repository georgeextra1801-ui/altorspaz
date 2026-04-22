import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Search, ArrowDown, ArrowUp } from "lucide-react";

interface Item {
  id: string;
  store_name: string;
  product_title: string;
  variant_title: string | null;
  sku: string | null;
  quantity: number;
  unit_cost: number | null;
  total_value: number | null;
  category: string | null;
}

interface Movement {
  id: string;
  inventory_item_id: string;
  movement_reason: string;
  direction: "in" | "out";
  quantity: number;
  resulting_quantity: number;
  note: string | null;
  reference: string | null;
  sale_reference: string | null;
  created_at: string;
}

export default function AdminBodega() {
  const [items, setItems] = useState<Item[]>([]);
  const [movs, setMovs] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState<string>("all");

  const [newItemOpen, setNewItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    store_name: "",
    product_title: "",
    variant_title: "",
    sku: "",
    quantity: 0,
    unit_cost: 0,
    category: "",
  });

  const [moveOpen, setMoveOpen] = useState(false);
  const [moveItem, setMoveItem] = useState<Item | null>(null);
  const [moveData, setMoveData] = useState({
    direction: "in" as "in" | "out",
    movement_reason: "purchase_supplier" as string,
    quantity: 1,
    reference: "",
    sale_reference: "",
    note: "",
  });

  const load = async () => {
    setLoading(true);
    const [{ data: i }, { data: m }] = await Promise.all([
      supabase.from("inventory_items").select("*").order("product_title"),
      supabase.from("inventory_movements").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setItems((i ?? []) as Item[]);
    setMovs((m ?? []) as Movement[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stores = useMemo(() => Array.from(new Set(items.map((i) => i.store_name))).sort(), [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((i) => {
      if (storeFilter !== "all" && i.store_name !== storeFilter) return false;
      if (!q) return true;
      return (
        i.product_title.toLowerCase().includes(q) ||
        (i.sku ?? "").toLowerCase().includes(q) ||
        (i.variant_title ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search, storeFilter]);

  const totals = useMemo(() => {
    const qty = filtered.reduce((s, i) => s + (i.quantity ?? 0), 0);
    const val = filtered.reduce((s, i) => s + (i.total_value ?? (i.quantity ?? 0) * (i.unit_cost ?? 0)), 0);
    return { qty, val, count: filtered.length };
  }, [filtered]);

  const createItem = async () => {
    if (!newItem.product_title || !newItem.store_name) {
      toast.error("Producto y bodega son obligatorios");
      return;
    }
    // Crear upload "manual"
    const { data: up, error: e1 } = await supabase
      .from("inventory_uploads")
      .insert({
        store_name: newItem.store_name,
        file_name: "manual.csv",
        file_path: `manual/${Date.now()}.csv`,
        status: "manual",
      })
      .select()
      .single();
    if (e1) return toast.error(e1.message);

    const { error } = await supabase.from("inventory_items").insert({
      ...newItem,
      total_value: newItem.quantity * newItem.unit_cost,
      upload_id: up.id,
    });
    if (error) return toast.error(error.message);
    toast.success("Producto creado");
    setNewItemOpen(false);
    setNewItem({ store_name: "", product_title: "", variant_title: "", sku: "", quantity: 0, unit_cost: 0, category: "" });
    load();
  };

  const submitMovement = async () => {
    if (!moveItem) return;
    if (moveData.direction === "out" && moveData.movement_reason === "sale_dispatch") {
      const { error } = await supabase.rpc("record_warehouse_dispatch", {
        _inventory_item_id: moveItem.id,
        _quantity: moveData.quantity,
        _sale_reference: moveData.sale_reference || undefined,
        _note: moveData.note || undefined,
      });
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.rpc("record_inventory_entry", {
        _inventory_item_id: moveItem.id,
        _movement_reason: moveData.movement_reason as any,
        _direction: moveData.direction,
        _quantity: moveData.quantity,
        _reference: moveData.reference || undefined,
        _note: moveData.note || undefined,
      });
      if (error) return toast.error(error.message);
    }
    toast.success("Movimiento registrado");
    setMoveOpen(false);
    setMoveItem(null);
    setMoveData({ direction: "in", movement_reason: "purchase_supplier", quantity: 1, reference: "", sale_reference: "", note: "" });
    load();
  };

  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-display tracking-wide">Bodega</h1>
        <Dialog open={newItemOpen} onOpenChange={setNewItemOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Nuevo producto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo ítem de inventario</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Bodega</Label><Input value={newItem.store_name} onChange={(e) => setNewItem({ ...newItem, store_name: e.target.value })} /></div>
              <div><Label>Producto</Label><Input value={newItem.product_title} onChange={(e) => setNewItem({ ...newItem, product_title: e.target.value })} /></div>
              <div><Label>Variante</Label><Input value={newItem.variant_title} onChange={(e) => setNewItem({ ...newItem, variant_title: e.target.value })} /></div>
              <div><Label>SKU</Label><Input value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Cantidad</Label><Input type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })} /></div>
                <div><Label>Costo unitario</Label><Input type="number" value={newItem.unit_cost} onChange={(e) => setNewItem({ ...newItem, unit_cost: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Categoría</Label><Input value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewItemOpen(false)}>Cancelar</Button>
              <Button onClick={createItem}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="kardex">Kardex</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4"><p className="text-xs text-muted-foreground">Ítems</p><p className="text-2xl font-bold">{totals.count}</p></Card>
            <Card className="p-4"><p className="text-xs text-muted-foreground">Unidades</p><p className="text-2xl font-bold">{totals.qty}</p></Card>
            <Card className="p-4"><p className="text-xs text-muted-foreground">Valor total</p><p className="text-2xl font-bold">${totals.val.toLocaleString()}</p></Card>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar producto, SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las bodegas</SelectItem>
                {stores.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : (
            <Card className="divide-y">
              {filtered.map((i) => (
                <div key={i.id} className="p-3 flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{i.product_title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {i.variant_title} · SKU: {i.sku ?? "—"} · {i.store_name}
                    </p>
                  </div>
                  <Badge variant={i.quantity > 0 ? "default" : "outline"}>{i.quantity} u.</Badge>
                  <span className="text-sm text-muted-foreground w-24 text-right">
                    ${(i.total_value ?? 0).toLocaleString()}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => { setMoveItem(i); setMoveOpen(true); }}>
                    Movimiento
                  </Button>
                </div>
              ))}
              {filtered.length === 0 && <p className="p-4 text-muted-foreground">Sin resultados.</p>}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="kardex" className="mt-4">
          <Card className="divide-y">
            {movs.map((m) => {
              const it = itemMap.get(m.inventory_item_id);
              return (
                <div key={m.id} className="p-3 flex items-center gap-3 flex-wrap">
                  {m.direction === "in" ? <ArrowDown className="h-4 w-4 text-green-600" /> : <ArrowUp className="h-4 w-4 text-red-600" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{it?.product_title ?? "(item eliminado)"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()} · {m.movement_reason} · {m.note ?? m.reference ?? m.sale_reference ?? ""}
                    </p>
                  </div>
                  <Badge variant={m.direction === "in" ? "default" : "destructive"}>
                    {m.direction === "in" ? "+" : "-"}{m.quantity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">→ {m.resulting_quantity}</span>
                </div>
              );
            })}
            {movs.length === 0 && <p className="p-4 text-muted-foreground">No hay movimientos.</p>}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar movimiento</DialogTitle></DialogHeader>
          {moveItem && (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">{moveItem.product_title} · Stock actual: <strong>{moveItem.quantity}</strong></p>
              <div>
                <Label>Tipo</Label>
                <Select value={moveData.direction} onValueChange={(v: "in" | "out") => setMoveData({ ...moveData, direction: v, movement_reason: v === "in" ? "purchase_supplier" : "sale_dispatch" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Entrada</SelectItem>
                    <SelectItem value="out">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Motivo</Label>
                <Select value={moveData.movement_reason} onValueChange={(v) => setMoveData({ ...moveData, movement_reason: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {moveData.direction === "in" ? (
                      <>
                        <SelectItem value="purchase_supplier">Compra a proveedor</SelectItem>
                        <SelectItem value="customer_return">Devolución cliente</SelectItem>
                        <SelectItem value="manual_adjustment">Ajuste manual</SelectItem>
                        <SelectItem value="store_transfer">Traslado</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="sale_dispatch">Despacho por venta</SelectItem>
                        <SelectItem value="manual_adjustment">Ajuste manual</SelectItem>
                        <SelectItem value="store_transfer">Traslado</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Cantidad</Label><Input type="number" min={1} value={moveData.quantity} onChange={(e) => setMoveData({ ...moveData, quantity: Number(e.target.value) })} /></div>
              {moveData.movement_reason === "sale_dispatch" ? (
                <div><Label>Referencia de venta</Label><Input value={moveData.sale_reference} onChange={(e) => setMoveData({ ...moveData, sale_reference: e.target.value })} /></div>
              ) : (
                <div><Label>Referencia (factura, OC...)</Label><Input value={moveData.reference} onChange={(e) => setMoveData({ ...moveData, reference: e.target.value })} /></div>
              )}
              <div><Label>Nota</Label><Textarea rows={2} value={moveData.note} onChange={(e) => setMoveData({ ...moveData, note: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveOpen(false)}>Cancelar</Button>
            <Button onClick={submitMovement}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
