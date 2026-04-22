import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Fallback images
import heroBanner1 from "@/assets/hero-banner-paragliding.jpg";
import heroBanner2 from "@/assets/hero-banner-sports.jpg";

interface HeroSlide {
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
  overlay_image_url: string | null;
  overlay_position_x: number;
  overlay_position_y: number;
  overlay_scale: number;
  overlay_from_color: string;
  overlay_via_color: string;
  highlight_color: string;
  highlight_hex: string;
  title_color: string;
  title_font: string;
  title_size: string;
  subtitle_color: string;
  subtitle_font: string;
  subtitle_size: string;
  badge_bg_color: string;
  badge_text_color: string;
  text_align: string;
  is_active: boolean;
  sort_order: number;
}

const fallbackSlides: Partial<HeroSlide>[] = [
  {
    id: "fb1",
    title: "ENTRENA",
    highlight: "CON ESTILO",
    highlight_color: "accent",
    subtitle: "Descubre nuestra colección de ropa deportiva diseñada para colombianísimas que buscan rendimiento y estilo.",
    cta_link: "/mujeres",
    cta_text: "Comprar Ahora",
    cta2_link: "/ofertas",
    cta2_text: "Ver Ofertas",
    badge_text: "Nueva Colección 2026",
    image_url: heroBanner1,
  },
  {
    id: "fb2",
    title: "VIVE",
    highlight: "LA AVENTURA",
    highlight_color: "spaz-green",
    subtitle: "Ropa deportiva de alta calidad para todos tus deportes favoritos. Ciclismo, running, patinaje y más.",
    cta_link: "/hombres",
    cta_text: "Ver Colección",
    cta2_link: "/ofertas",
    cta2_text: "Ver Ofertas",
    badge_text: "Nueva Colección 2026",
    image_url: heroBanner2,
  },
];

export const HeroCarousel = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setSlides(data as HeroSlide[]);
      } else {
        setSlides(fallbackSlides as HeroSlide[]);
      }
    })();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (slides.length ? (prev - 1 + slides.length) % slides.length : 0));
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, slides.length]);

  if (slides.length === 0) {
    return <section className="relative h-[80vh] min-h-[600px] bg-muted animate-pulse" />;
  }

  const slide = slides[currentSlide];
  const highlightClass =
    slide.highlight_color === "spaz-green" ? "text-spaz-green" : "text-accent";

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background images */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {s.image_url && (
            <img
              src={s.image_url}
              alt={s.title || "Banner"}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          )}
        </div>
      ))}

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${slide.overlay_from_color || "hsl(0 0% 0% / 0.7)"}, ${slide.overlay_via_color || "hsl(0 0% 0% / 0.4)"}, transparent)`,
        }}
      />

      {/* Overlay image (logo) */}
      {slide.overlay_image_url && (
        <img
          src={slide.overlay_image_url}
          alt="Overlay"
          className="absolute pointer-events-none object-contain"
          style={{
            left: `${slide.overlay_position_x}%`,
            top: `${slide.overlay_position_y}%`,
            width: `${slide.overlay_scale}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          <div className="text-primary-foreground space-y-6 animate-fade-in" key={currentSlide}>
            {slide.badge_text && (
              <div className="inline-block bg-accent text-accent-foreground px-4 py-1 text-sm font-medium rounded-full">
                {slide.badge_text}
              </div>
            )}
            {(slide.title || slide.highlight) && (
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none">
                {slide.title}
                {slide.title && slide.highlight && <br />}
                {slide.highlight && (
                  <span className={highlightClass}>{slide.highlight}</span>
                )}
              </h1>
            )}
            {slide.subtitle && (
              <p className="text-primary-foreground/90 text-lg max-w-md">
                {slide.subtitle}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {slide.cta_text && (
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to={slide.cta_link || "/"}>
                    {slide.cta_text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {slide.cta2_text && (
                <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to={slide.cta2_link || "/ofertas"}>{slide.cta2_text}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-accent w-8"
                  : "bg-primary-foreground/50 hover:bg-primary-foreground/80 w-3"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
