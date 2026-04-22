import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, Package, ArrowRight } from "lucide-react";

interface UploadRow {
  id: string;
  file_name: string;
  store_name: string;
  status: string;
  row_count: number | null;
  created_at: string;
}

export default function AdminInventario() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [storeName, setStoreName] = useState("");
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("inventory_uploads")
      .select("id, file_name, store_name, status, row_count, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    setUploads(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!storeName.trim()) {
      toast.error("Indica el nombre de la bodega primero");
      return;
    }
    setBusy(true);
    try {
      const path = `${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("inventory-files")
        .upload(path, file);
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("inventory_uploads").insert({
        file_name: file.name,
        file_path: path,
        file_size: file.size,
        store_name: storeName.trim(),
        status: "uploaded",
      });
      if (insErr) throw insErr;

      toast.success("Archivo subido. Procesa los items en Bodega.");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error subiendo archivo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display tracking-wide">Inventario</h1>
          <p className="text-muted-foreground">Sube CSVs de inventario por bodega.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/bodega">
            <Package className="mr-2 h-4 w-4" /> Ir a Bodega <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" /> Subir archivo CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre de bodega</Label>
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ej: Bodega principal"
              />
            </div>
            <div>
              <Label>Archivo CSV / Excel</Label>
              <Input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleUpload}
                disabled={busy || !storeName.trim()}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Excluye automáticamente la bodega "salida baja rotación" del cálculo web.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Historial de cargas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploads.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay cargas aún.</p>
          ) : (
            <div className="divide-y">
              {uploads.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-medium">{u.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.store_name} · {new Date(u.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.row_count !== null && <Badge variant="outline">{u.row_count} filas</Badge>}
                    <Badge variant={u.status === "processed" ? "default" : "secondary"}>{u.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
