import { useEffect, useState } from "react";
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
import { Plus, TrendingUp, TrendingDown, Receipt, Building2 } from "lucide-react";

type Section = "ventas" | "egresos" | "recibos" | "compras" | "costos" | "conciliaciones";

const tableMap: Record<Section, string> = {
  ventas: "manual_sales",
  egresos: "expenses",
  recibos: "cash_receipts",
  compras: "supplier_purchases",
  costos: "product_costs",
  conciliaciones: "bank_reconciliations",
};

interface FieldDef {
  key: string;
  label: string;
  type?: "number" | "date" | "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

const formDefs: Record<Section, { fields: FieldDef[]; defaults: any }> = {
  ventas: {
    defaults: { sale_date: new Date().toISOString().slice(0, 10), product_title: "", quantity: 1, unit_price: 0, total_price: 0, channel: "tienda_fisica", sku: "" },
    fields: [
      { key: "sale_date", label: "Fecha", type: "date", required: true },
      { key: "product_title", label: "Producto", required: true },
      { key: "variant_title", label: "Variante" },
      { key: "sku", label: "SKU" },
      { key: "quantity", label: "Cantidad", type: "number", required: true },
      { key: "unit_price", label: "Precio unitario", type: "number", required: true },
      { key: "total_price", label: "Precio total", type: "number", required: true },
      { key: "channel", label: "Canal", type: "select", options: ["tienda_fisica", "online", "mayorista", "otro"] },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  egresos: {
    defaults: { expense_date: new Date().toISOString().slice(0, 10), expense_number: "", payee_name: "", concept: "", amount: 0, category: "otros", payment_method: "efectivo" },
    fields: [
      { key: "expense_date", label: "Fecha", type: "date", required: true },
      { key: "expense_number", label: "N° de egreso", required: true },
      { key: "payee_name", label: "Beneficiario", required: true },
      { key: "concept", label: "Concepto", required: true },
      { key: "amount", label: "Monto", type: "number", required: true },
      { key: "category", label: "Categoría", type: "select", options: ["materia_prima", "servicios", "nomina", "alquiler", "marketing", "logistica", "otros"] },
      { key: "payment_method", label: "Método de pago", type: "select", options: ["efectivo", "transferencia", "tarjeta", "cheque"] },
      { key: "reference_number", label: "Referencia" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  recibos: {
    defaults: { receipt_date: new Date().toISOString().slice(0, 10), receipt_number: "", payer_name: "", concept: "", amount: 0, payment_method: "efectivo" },
    fields: [
      { key: "receipt_date", label: "Fecha", type: "date", required: true },
      { key: "receipt_number", label: "N° de recibo", required: true },
      { key: "payer_name", label: "Pagador", required: true },
      { key: "concept", label: "Concepto", required: true },
      { key: "amount", label: "Monto", type: "number", required: true },
      { key: "payment_method", label: "Método de pago", type: "select", options: ["efectivo", "transferencia", "tarjeta", "cheque"] },
      { key: "reference_number", label: "Referencia" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  compras: {
    defaults: { purchase_date: new Date().toISOString().slice(0, 10), supplier_name: "", product_title: "", quantity: 1, unit_cost: 0, total_cost: 0, category: "materia_prima", payment_method: "transferencia" },
    fields: [
      { key: "purchase_date", label: "Fecha", type: "date", required: true },
      { key: "supplier_name", label: "Proveedor", required: true },
      { key: "product_title", label: "Producto", required: true },
      { key: "variant_title", label: "Variante" },
      { key: "sku", label: "SKU" },
      { key: "quantity", label: "Cantidad", type: "number", required: true },
      { key: "unit_cost", label: "Costo unitario", type: "number", required: true },
      { key: "total_cost", label: "Costo total", type: "number", required: true },
      { key: "category", label: "Categoría", type: "select", options: ["materia_prima", "insumos", "maquila", "otros"] },
      { key: "payment_method", label: "Método de pago", type: "select", options: ["efectivo", "transferencia", "tarjeta", "credito"] },
      { key: "invoice_number", label: "N° factura" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  costos: {
    defaults: { product_title: "", unit_cost: 0 },
    fields: [
      { key: "product_title", label: "Producto", required: true },
      { key: "variant_title", label: "Variante" },
      { key: "sku", label: "SKU" },
      { key: "supplier", label: "Proveedor" },
      { key: "unit_cost", label: "Costo unitario", type: "number", required: true },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  conciliaciones: {
    defaults: { reconciliation_date: new Date().toISOString().slice(0, 10), bank_name: "", bank_balance: 0, book_balance: 0, status: "pendiente", difference: 0 },
    fields: [
      { key: "reconciliation_date", label: "Fecha", type: "date", required: true },
      { key: "bank_name", label: "Banco", required: true },
      { key: "account_number", label: "N° cuenta" },
      { key: "bank_balance", label: "Saldo banco", type: "number", required: true },
      { key: "book_balance", label: "Saldo libros", type: "number", required: true },
      { key: "difference", label: "Diferencia", type: "number" },
      { key: "status", label: "Estado", type: "select", options: ["pendiente", "conciliada", "diferencia"] },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
};

const renderRow = (section: Section, row: any) => {
  switch (section) {
    case "ventas":
      return { primary: row.product_title, secondary: `${row.sale_date} · ${row.quantity} u. · ${row.channel}`, amount: row.total_price };
    case "egresos":
      return { primary: row.payee_name, secondary: `${row.expense_date} · ${row.concept} · ${row.category}`, amount: -row.amount };
    case "recibos":
      return { primary: row.payer_name, secondary: `${row.receipt_date} · ${row.concept}`, amount: row.amount };
    case "compras":
      return { primary: row.supplier_name, secondary: `${row.purchase_date} · ${row.product_title} · ${row.quantity} u.`, amount: -row.total_cost };
    case "costos":
      return { primary: row.product_title, secondary: `${row.variant_title ?? ""} · ${row.sku ?? ""}`, amount: row.unit_cost };
    case "conciliaciones":
      return { primary: row.bank_name, secondary: `${row.reconciliation_date} · ${row.status}`, amount: row.difference };
  }
};

function SectionPanel({ section }: { section: Section }) {
  const def = formDefs[section];
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(def.defaults);

  const load = async () => {
    setLoading(true);
    const orderField = def.fields.find((f) => f.type === "date")?.key ?? "created_at";
    const { data, error } = await (supabase as any).from(tableMap[section]).select("*").order(orderField, { ascending: false }).limit(200);
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [section]);

  const save = async () => {
    for (const f of def.fields) {
      if (f.required && (form[f.key] === "" || form[f.key] == null)) {
        toast.error(`Campo obligatorio: ${f.label}`);
        return;
      }
    }
    // auto totales
    if (section === "ventas" && !form.total_price) form.total_price = form.quantity * form.unit_price;
    if (section === "compras" && !form.total_cost) form.total_cost = form.quantity * form.unit_cost;
    const { error } = await (supabase as any).from(tableMap[section]).insert(form);
    if (error) return toast.error(error.message);
    toast.success("Registro guardado");
    setOpen(false);
    setForm(def.defaults);
    load();
  };

  const total = rows.reduce((s, r) => s + (renderRow(section, r)?.amount ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Card className="p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-muted-foreground">Total ({rows.length} registros)</p>
          <p className={`text-2xl font-bold ${total < 0 ? "text-red-600" : "text-green-600"}`}>
            ${Math.abs(total).toLocaleString()}
          </p>
        </Card>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(def.defaults)}>
              <Plus className="h-4 w-4 mr-1" /> Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nuevo registro</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              {def.fields.map((f) => (
                <div key={f.key}>
                  <Label>{f.label}{f.required && " *"}</Label>
                  {f.type === "textarea" ? (
                    <Textarea rows={2} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                  ) : f.type === "select" ? (
                    <Select value={form[f.key] ?? ""} onValueChange={(v) => setForm({ ...form, [f.key]: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={save}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : (
        <Card className="divide-y">
          {rows.map((r) => {
            const v = renderRow(section, r)!;
            return (
              <div key={r.id} className="p-3 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{v.primary}</p>
                  <p className="text-xs text-muted-foreground truncate">{v.secondary}</p>
                </div>
                <Badge variant={v.amount < 0 ? "destructive" : "default"}>
                  ${Math.abs(v.amount ?? 0).toLocaleString()}
                </Badge>
              </div>
            );
          })}
          {rows.length === 0 && <p className="p-4 text-muted-foreground">Sin registros.</p>}
        </Card>
      )}
    </div>
  );
}

export default function AdminContabilidad() {
  return (
    <div>
      <h1 className="text-3xl font-display tracking-wide mb-6">Contabilidad</h1>
      <Tabs defaultValue="ventas">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="ventas"><TrendingUp className="h-4 w-4 mr-1" /> Ventas</TabsTrigger>
          <TabsTrigger value="egresos"><TrendingDown className="h-4 w-4 mr-1" /> Egresos</TabsTrigger>
          <TabsTrigger value="recibos"><Receipt className="h-4 w-4 mr-1" /> Recibos</TabsTrigger>
          <TabsTrigger value="compras">Compras</TabsTrigger>
          <TabsTrigger value="costos">Costos</TabsTrigger>
          <TabsTrigger value="conciliaciones"><Building2 className="h-4 w-4 mr-1" /> Conciliaciones</TabsTrigger>
        </TabsList>
        {(["ventas", "egresos", "recibos", "compras", "costos", "conciliaciones"] as Section[]).map((s) => (
          <TabsContent key={s} value={s} className="mt-4">
            <SectionPanel section={s} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
