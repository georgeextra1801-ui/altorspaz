import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
}

interface Banner {
  banner_slot: number;
  image_url: string | null;
  alt_text: string | null;
}

export default function CampaignLanding() {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data: c } = await supabase
        .from("campaign_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (!c) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setCampaign(c as Campaign);
      const { data: b } = await supabase
        .from("campaign_banners")
        .select("banner_slot, image_url, alt_text")
        .eq("campaign_key", c.campaign_key)
        .order("banner_slot");
      setBanners((b ?? []) as Banner[]);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando campaña...</p>
      </div>
    );
  }

  if (notFound || !campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
          <h1 className="text-3xl font-display">Campaña no disponible</h1>
          <p className="text-muted-foreground">La campaña que buscas no existe o no está publicada.</p>
          <Link to="/" className="text-primary underline">Volver al inicio</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {campaign.top_strip_text && (
        <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium px-4">
          {campaign.top_strip_text}
        </div>
      )}

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 py-10 text-center">
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-3">
            {campaign.hero_primary_text}
          </h1>
          {campaign.hero_secondary_text && (
            <p className="text-2xl md:text-4xl font-display text-accent mb-6">
              {campaign.hero_secondary_text}
            </p>
          )}
          <div className="flex justify-center gap-3 flex-wrap">
            <Button asChild size="lg">
              <Link to={campaign.primary_button_link || `/producto/${campaign.product_handle}`}>
                {campaign.primary_button_text}
              </Link>
            </Button>
            {campaign.secondary_button_text && (
              <Button asChild size="lg" variant="outline">
                <Link to={campaign.secondary_button_link}>{campaign.secondary_button_text}</Link>
              </Button>
            )}
          </div>
        </section>

        {/* Banners apilados */}
        {banners.length > 0 && (
          <section className="container mx-auto px-4 pb-10 space-y-4">
            {banners.map((b) =>
              b.image_url ? (
                <Link key={b.banner_slot} to={campaign.primary_button_link || `/producto/${campaign.product_handle}`}>
                  <img
                    src={b.image_url}
                    alt={b.alt_text ?? `Banner ${b.banner_slot}`}
                    className="w-full h-auto rounded-md"
                    loading={b.banner_slot === 1 ? "eager" : "lazy"}
                  />
                </Link>
              ) : null
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
