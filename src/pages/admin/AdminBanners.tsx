import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Slide {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  badge_text: string;
  cta_text: string;
  cta_link: string;
  cta2_text: string;
  cta2_link: string;
  image_url: string | null;
  storage_path: string | null;
  overlay_image_url: string | null;
  overlay_storage_path: string | null;
  overlay_position_x: number;
  overlay_position_y: number;
  overlay_scale: number;
  is_active: boolean;
  sort_order: number;
}

const empty: Partial<Slide> = {
  title: "",
  highlight: "",
  subtitle: "",
  badge_text: "",
  cta_text: "Comprar Ahora",
  cta_link: "/",
  cta2_text: "Ver Ofertas",
  cta2_link: "/ofertas",
  is_active: true,
  sort_order: 0,
  overlay_position_x: 80,
  overlay_position_y: 10,
  overlay_scale: 15,
};

export default function AdminBanners() {
  const [list, setList] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Slide> | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState<"main" | "overlay" | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    else setList((data ?? []) as Slide[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (file: File, kind: "main" | "overlay") => {
    setUploading(kind);
    const ext = file.name.split(".").pop();
    const path = `${kind}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("hero-banners").upload(path, file);
    if (error) {
      toast.error(error.message);
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from("hero-banners").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;
    if (kind === "main") {
      setEditing((p) => ({ ...p!, image_url: url, storage_path: path }));
    } else {
      setEditing((p) => ({ ...p!, overlay_image_url: url, overlay_storage_path: path }));
    }
    setUploading(null);
    toast.success("Imagen subida");
  };

  const save = async () => {
    if (!editing?.title) {
      toast.error("El título es obligatorio");
      return;
    }
    const payload = { ...editing };
    let error;
    if ((editing as Slide).id) {
      ({ error } = await supabase.from("hero_slides").update(payload).eq("id", (editing as Slide).id));
    } else {
      ({ error } = await supabase.from("hero_slides").insert(payload as any));
    }
    if (error) return toast.error(error.message);
    toast.success("Banner guardado");
    setOpen(false);
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("¿Eliminar banner?")) return;
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Banner eliminado");
    load();
  };

  const toggleActive = async (s: Slide) => {
    const { error } = await supabase
      .from("hero_slides")
      .update({ is_active: !s.is_active })
      .eq("id", s.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-display tracking-wide">Banners del Home</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...empty, sort_order: list.length })}>
              <Plus className="h-4 w-4 mr-1" /> Nuevo banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{(editing as Slide)?.id ? "Editar banner" : "Nuevo banner"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="grid gap-3">
                <div>
                  <Label>Imagen principal</Label>
                  {editing.image_url && (
                    <img src={editing.image_url} alt="" className="w-full h-32 object-cover rounded mb-2" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploading === "main"}
                    onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "main")}
                  />
                </div>
                <div>
                  <Label>Imagen overlay (logo, opcional)</Label>
                  {editing.overlay_image_url && (
                    <img src={editing.overlay_image_url} alt="" className="h-20 object-contain rounded mb-2" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploading === "overlay"}
                    onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "overlay")}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Overlay X (%)</Label>
                    <Input type="number" value={editing.overlay_position_x ?? 80}
                      onChange={(e) => setEditing({ ...editing, overlay_position_x: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Overlay Y (%)</Label>
                    <Input type="number" value={editing.overlay_position_y ?? 10}
                      onChange={(e) => setEditing({ ...editing, overlay_position_y: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Overlay escala (%)</Label>
                    <Input type="number" value={editing.overlay_scale ?? 15}
                      onChange={(e) => setEditing({ ...editing, overlay_scale: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <Label>Título</Label>
                  <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <Label>Highlight (parte coloreada del título)</Label>
                  <Input value={editing.highlight ?? ""} onChange={(e) => setEditing({ ...editing, highlight: e.target.value })} />
                </div>
                <div>
                  <Label>Subtítulo</Label>
                  <Textarea rows={2} value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
                </div>
                <div>
                  <Label>Texto del badge</Label>
                  <Input value={editing.badge_text ?? ""} onChange={(e) => setEditing({ ...editing, badge_text: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>CTA 1 - texto</Label>
                    <Input value={editing.cta_text ?? ""} onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })} />
                  </div>
                  <div>
                    <Label>CTA 1 - link</Label>
                    <Input value={editing.cta_link ?? ""} onChange={(e) => setEditing({ ...editing, cta_link: e.target.value })} />
                  </div>
                  <div>
                    <Label>CTA 2 - texto</Label>
                    <Input value={editing.cta2_text ?? ""} onChange={(e) => setEditing({ ...editing, cta2_text: e.target.value })} />
                  </div>
                  <div>
                    <Label>CTA 2 - link</Label>
                    <Input value={editing.cta2_link ?? ""} onChange={(e) => setEditing({ ...editing, cta2_link: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Orden</Label>
                  <Input type="number" value={editing.sort_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={!!editing.is_active}
                    onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                  <Label>Activo</Label>
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
        <div className="grid gap-3">
          {list.map((s) => (
            <Card key={s.id} className="p-4 flex items-center gap-4">
              {s.image_url && <img src={s.image_url} alt="" className="w-32 h-20 object-cover rounded" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.title} <span className="text-accent">{s.highlight}</span></p>
                <p className="text-xs text-muted-foreground truncate">{s.subtitle}</p>
                <p className="text-xs text-muted-foreground">Orden: {s.sort_order} · {s.is_active ? "Activo" : "Inactivo"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleActive(s)}>
                  {s.is_active ? "Desactivar" : "Activar"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setEditing(s); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => del(s.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {list.length === 0 && <p className="text-muted-foreground">No hay banners. Crea el primero.</p>}
        </div>
      )}
    </div>
  );
}
