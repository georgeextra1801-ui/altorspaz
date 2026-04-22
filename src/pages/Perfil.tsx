import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Perfil() {
  const { user, loading, signOut } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: pub }, { data: priv }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("profile_private").select("phone, city, address").eq("user_id", user.id).maybeSingle(),
      ]);
      setDisplayName(pub?.display_name ?? "");
      setPhone(priv?.phone ?? "");
      setCity(priv?.city ?? "");
      setAddress(priv?.address ?? "");
    })();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
  if (!user) return <Navigate to="/auth?redirect=/perfil" replace />;

  const save = async () => {
    setBusy(true);
    const { error: e1 } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, display_name: displayName }, { onConflict: "user_id" });
    const { error: e2 } = await supabase
      .from("profile_private")
      .upsert({ user_id: user.id, phone, city, address }, { onConflict: "user_id" });
    setBusy(false);
    if (e1 || e2) return toast.error(e1?.message || e2?.message || "Error");
    toast.success("Perfil actualizado");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="font-display text-4xl mb-6">Mi cuenta</h1>
        <Card>
          <CardHeader>
            <CardTitle>Datos personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={user.email ?? ""} disabled />
            </div>
            <div>
              <Label>Nombre</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label>Ciudad</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={busy}>{busy ? "Guardando..." : "Guardar"}</Button>
              <Button variant="outline" onClick={signOut}>Cerrar sesión</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
