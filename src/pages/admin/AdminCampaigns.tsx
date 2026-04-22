import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";

interface Campaign {
  id: string;
  slug: string;
  name: string;
  campaign_key: string;
  product_handle: string;
  is_published: boolean;
  top_strip_text: string;
  hero_primary_text: string;
  hero_secondary_text: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  target_audience: string | null;
  updated_at: string;
}

const empty: Partial<Campaign> = {
  slug: "",
  name: "",
  campaign_key: "",
  product_handle: "",
  is_published: false,
  top_strip_text: "🚚 ENVÍO GRATIS A TODO EL PAÍS • ✅ GARANTÍA 30 DÍAS • 💵 PAGO CONTRA ENTREGA",
  hero_primary_text: "COMPRA AQUÍ Y PAGA AL RECIBIR",
  hero_secondary_text: "PACK X3",
  primary_button_text: "Comprar ahora",
  primary_button_link: "/producto/",
  secondary_button_text: "Ver ofertas",
  secondary_button_link: "/ofertas",
};

export default function AdminCampaigns() {
  const [list, setList] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Campaign> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("campaign_pages").select("*").order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList((data ?? []) as Campaign[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.slug || !editing.name || !editing.campaign_key || !editing.product_handle) {
      toast.error("Slug, nombre, campaign_key y product_handle son obligatorios");
      return;
    }
    const payload = { ...editing };
    let error;
    if ((editing as Campaign).id) {
      ({ error } = await supabase.from("campaign_pages").update(payload).eq("id", (editing as Campaign).id));
    } else {
      ({ error } = await supabase.from("campaign_pages").insert(payload as any));
    }
    if (error) return toast.error(error.message);
    toast.success("Campaña guardada");
    setOpen(false);
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("¿Eliminar campaña?")) return;
    const { error } = await supabase.from("campaign_pages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Campaña eliminada");
    load();
  };

  const togglePublish = async (c: Campaign) => {
    const { error } = await supabase.from("campaign_pages").update({ is_published: !c.is_published }).eq("id", c.id);
    if (error) return toast.error(error.message);
    load();
  };

  const fields: Array<[keyof Campaign, string, string?]> = [
    ["slug", "Slug (URL)"],
    ["name", "Nombre interno"],
    ["campaign_key", "Campaign key (banners)"],
    ["product_handle", "Handle del producto"],
    ["target_audience", "Audiencia objetivo"],
    ["top_strip_text", "Franja superior"],
    ["hero_primary_text", "Hero - texto principal"],
    ["hero_secondary_text", "Hero - texto secundario"],
    ["primary_button_text", "Botón 1 - texto"],
    ["primary_button_link", "Botón 1 - link"],
    ["secondary_button_text", "Botón 2 - texto"],
    ["secondary_button_link", "Botón 2 - link"],
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-display tracking-wide">Campañas</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...empty })}>
              <Plus className="h-4 w-4 mr-1" /> Nueva campaña
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{(editing as Campaign)?.id ? "Editar campaña" : "Nueva campaña"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="grid gap-3">
                {fields.map(([key, label]) => (
                  <div key={key as string}>
                    <Label htmlFor={key as string}>{label}</Label>
                    {(key === "top_strip_text" || key === "hero_primary_text") ? (
                      <Textarea
                        id={key as string}
                        value={(editing[key] as string) ?? ""}
                        onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                        rows={2}
                      />
                    ) : (
                      <Input
                        id={key as string}
                        value={(editing[key] as string) ?? ""}
                        onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={!!editing.is_published}
                    onCheckedChange={(v) => setEditing({ ...editing, is_published: v })}
                  />
                  <Label htmlFor="published">Publicada</Label>
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

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : (
        <Card className="divide-y">
          {list.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{c.name}</p>
                  <Badge variant={c.is_published ? "default" : "outline"}>
                    {c.is_published ? "Publicada" : "Borrador"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">/{c.slug} → {c.product_handle}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/campanas/${c.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => togglePublish(c)}>
                  {c.is_published ? "Despublicar" : "Publicar"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setEditing(c); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => del(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="p-4 text-muted-foreground">No hay campañas.</p>}
        </Card>
      )}
    </div>
  );
}
