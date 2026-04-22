import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ShopifyNotasPedido() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId") || params.get("id") || "";
  const [comment, setComment] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from("order_annotations")
        .select("comment, shipping_cost")
        .eq("shopify_order_id", orderId)
        .maybeSingle();
      setComment(data?.comment ?? "");
      setShippingCost(data?.shipping_cost?.toString() ?? "");
      setLoading(false);
    })();
  }, [orderId]);

  const save = async () => {
    if (!orderId) return toast.error("Falta orderId en la URL");
    setBusy(true);
    const payload = {
      shopify_order_id: orderId,
      comment: comment || null,
      shipping_cost: shippingCost ? parseFloat(shippingCost) : null,
    };
    const { data: existing } = await supabase
      .from("order_annotations").select("id").eq("shopify_order_id", orderId).maybeSingle();
    const { error } = existing
      ? await supabase.from("order_annotations").update(payload).eq("id", existing.id)
      : await supabase.from("order_annotations").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Anotación guardada");
  };

  if (!orderId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Falta el parámetro <code>?orderId=</code></p>
        </CardContent>
      </Card>
    );
  }
  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="font-display tracking-wide">Anotaciones del pedido</CardTitle>
        <p className="text-xs text-muted-foreground font-mono">Order: {orderId}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Costo de envío (COP)</Label>
          <Input
            type="number"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Comentario interno</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="Notas internas para el equipo..."
          />
        </div>
        <Button onClick={save} disabled={busy} className="w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
        </Button>
      </CardContent>
    </Card>
  );
}
