import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner-paragliding.jpg";

export const HeroSection = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBanner})` }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      
      {/* Brand color accents */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,_hsl(var(--accent))_0%,_transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_hsl(var(--spaz-green))_0%,_transparent_30%)]" />
      </div>
      
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          {/* Content */}
          <div className="text-primary-foreground space-y-6 animate-fade-in">
            <div className="inline-block bg-accent text-accent-foreground px-4 py-1 text-sm font-medium rounded-full">
              Nueva Colección 2026
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none">
              ENTRENA<br />
              <span className="text-accent">CON </span>
              <span className="text-spaz-green">ESTILO</span>
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-md">
              Descubre nuestra colección de ropa deportiva diseñada para colombianísimas que buscan rendimiento y estilo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/mujeres">
                  Comprar Ahora
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
      </div>
    </section>
  );
};
