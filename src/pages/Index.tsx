import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OffersCarousel } from "@/components/OffersCarousel";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { ProductGrid } from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroCarousel />

        {/* PRODUCTOS PRINCIPALES (carrusel ofertas) */}
        <OffersCarousel />

        {/* ¿QUÉ BUSCAS? (categorías) */}
        <CategoriesSection />

        {/* DESTACADOS */}
        <section className="py-16 bg-textured-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl mb-3">DESTACADOS</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Descubre nuestros productos más populares y novedades
              </p>
            </div>
            <ProductGrid limit={8} />
          </div>
        </section>

        <FeaturesSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
