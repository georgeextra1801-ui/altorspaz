import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });
    setBusy(false);
    if (error) {
      if (error.code === "23505") toast.info("Ya estás suscrito 🎉");
      else toast.error(error.message);
      return;
    }
    toast.success("¡Suscrito! Revisa tu correo.");
    setEmail("");
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h2 className="font-display text-3xl md:text-4xl mb-3 tracking-wide">
          ÚNETE A LA COMUNIDAD ALTOR
        </h2>
        <p className="mb-8 text-primary-foreground/90">
          Suscríbete y recibe ofertas exclusivas, novedades y un 10% de descuento en tu primera compra.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <Input
            type="email"
            required
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background text-foreground"
          />
          <Button type="submit" disabled={busy} variant="secondary" size="lg" className="bg-foreground text-background hover:bg-foreground/90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Suscribirse"}
          </Button>
        </form>
      </div>
    </section>
  );
};
