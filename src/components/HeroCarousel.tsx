import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Import banner images
import heroBanner1 from "@/assets/hero-banner-paragliding.jpg";
import heroBanner2 from "@/assets/hero-banner-sports.jpg";

interface BannerSlide {
  image: string;
  title: string;
  highlight: string;
  highlightColor: "accent" | "spaz-green";
  subtitle: string;
  ctaLink: string;
  ctaText: string;
}

const slides: BannerSlide[] = [
  {
    image: heroBanner1,
    title: "ENTRENA",
    highlight: "CON ESTILO",
    highlightColor: "accent",
    subtitle: "Descubre nuestra colección de ropa deportiva diseñada para colombianísimas que buscan rendimiento y estilo.",
    ctaLink: "/mujeres",
    ctaText: "Comprar Ahora",
  },
  {
    image: heroBanner2,
    title: "VIVE",
    highlight: "LA AVENTURA",
    highlightColor: "spaz-green",
    subtitle: "Ropa deportiva de alta calidad para todos tus deportes favoritos. Ciclismo, running, patinaje y más.",
    ctaLink: "/hombres",
    ctaText: "Ver Colección",
  },
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background images with transition */}
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />

      {/* Brand color accents */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,_hsl(var(--accent))_0%,_transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_hsl(var(--spaz-green))_0%,_transparent_30%)]" />
      </div>

      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          {/* Content with animation */}
          <div className="text-primary-foreground space-y-6 animate-fade-in" key={currentSlide}>
            <div className="inline-block bg-accent text-accent-foreground px-4 py-1 text-sm font-medium rounded-full">
              Nueva Colección 2026
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none">
              {slide.title}<br />
              <span className={slide.highlightColor === "accent" ? "text-accent" : "text-spaz-green"}>
                {slide.highlight}
              </span>
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-md">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to={slide.ctaLink}>
                  {slide.ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/ofertas">
                  Ver Ofertas
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
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
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-accent w-8"
                : "bg-primary-foreground/50 hover:bg-primary-foreground/80"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
