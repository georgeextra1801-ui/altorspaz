import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, ShieldOff } from "lucide-react";

interface ProfileRow {
  user_id: string;
  display_name: string | null;
  created_at: string;
  roles: string[];
}

export default function AdminUsers() {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const byUser = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = byUser.get(r.user_id) ?? [];
      arr.push(r.role);
      byUser.set(r.user_id, arr);
    });
    setRows((profiles ?? []).map((p: any) => ({ ...p, roles: byUser.get(p.user_id) ?? [] })));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Rol admin removido");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Rol admin asignado");
    }
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-display tracking-wide mb-6">Usuarios</h1>
      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : (
        <Card className="divide-y">
          {rows.map((r) => {
            const isAdmin = r.roles.includes("admin");
            return (
              <div key={r.user_id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium">{r.display_name ?? "(sin nombre)"}</p>
                  <p className="text-xs text-muted-foreground font-mono">{r.user_id}</p>
                  <div className="flex gap-1 mt-1">
                    {r.roles.length === 0 && <Badge variant="outline">user</Badge>}
                    {r.roles.map((role) => (
                      <Badge key={role} variant={role === "admin" ? "default" : "outline"}>{role}</Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant={isAdmin ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleAdmin(r.user_id, isAdmin)}
                >
                  {isAdmin ? (
                    <><ShieldOff className="h-4 w-4 mr-1" /> Quitar admin</>
                  ) : (
                    <><Shield className="h-4 w-4 mr-1" /> Hacer admin</>
                  )}
                </Button>
              </div>
            );
          })}
          {rows.length === 0 && <p className="p-4 text-muted-foreground">No hay usuarios.</p>}
        </Card>
      )}
    </div>
  );
}
