import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Printer } from "lucide-react";

interface Item {
  id: string;
  product_title: string;
  variant_title: string | null;
  sku: string | null;
  store_name: string;
}

const STORE_NAME = "SPAZ ALTOR";

function buildPayload(i: Item) {
  return JSON.stringify({
    sku: i.sku,
    product: i.product_title,
    variant: i.variant_title,
    store: STORE_NAME,
  });
}

function qrUrl(payload: string, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}`;
}

export default function AdminQR() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("inventory_items")
        .select("id, product_title, variant_title, sku, store_name")
        .not("sku", "is", null)
        .order("product_title");
      // únicos por SKU
      const seen = new Set<string>();
      const uniq: Item[] = [];
      for (const it of (data ?? []) as Item[]) {
        if (it.sku && !seen.has(it.sku)) { seen.add(it.sku); uniq.push(it); }
      }
      setItems(uniq);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      i.product_title.toLowerCase().includes(q) ||
      (i.sku ?? "").toLowerCase().includes(q) ||
      (i.variant_title ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const toggle = (id: string) => {
    setSelected((s) => {
      const ns = new Set(s);
      ns.has(id) ? ns.delete(id) : ns.add(id);
      return ns;
    });
  };

  const selectedItems = filtered.filter((i) => selected.has(i.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-display tracking-wide">Biblioteca QR</h1>
          <p className="text-muted-foreground text-sm">Genera códigos QR para los SKUs del inventario.</p>
        </div>
        <Button onClick={() => window.print()} disabled={selectedItems.length === 0}>
          <Printer className="h-4 w-4 mr-1" /> Imprimir seleccionados ({selectedItems.length})
        </Button>
      </div>

      <div className="relative mb-4 print:hidden">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar producto, SKU..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 print:hidden">
            {filtered.map((i) => {
              const sel = selected.has(i.id);
              return (
                <Card
                  key={i.id}
                  className={`p-3 cursor-pointer hover:border-primary text-center ${sel ? "border-primary border-2" : ""}`}
                  onClick={() => toggle(i.id)}
                >
                  <img src={qrUrl(buildPayload(i), 150)} alt="QR" className="mx-auto mb-2" />
                  <p className="text-xs font-medium truncate">{i.product_title}</p>
                  <p className="text-xs text-muted-foreground truncate">{i.variant_title}</p>
                  <p className="text-xs font-mono">{i.sku}</p>
                </Card>
              );
            })}
            {filtered.length === 0 && <p className="text-muted-foreground col-span-full">Sin resultados.</p>}
          </div>

          {/* Vista de impresión */}
          <div className="hidden print:grid grid-cols-3 gap-2">
            {selectedItems.map((i) => (
              <div key={i.id} className="border border-black p-2 text-center break-inside-avoid">
                <img src={qrUrl(buildPayload(i), 220)} alt="QR" className="mx-auto" />
                <p className="text-xs font-bold mt-1">{i.product_title}</p>
                <p className="text-[10px]">{i.variant_title}</p>
                <p className="text-xs font-mono">{i.sku}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
