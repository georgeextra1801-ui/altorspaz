import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProductGrid } from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroCarousel />
        <CategoriesSection />
        
        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl mb-4">PRODUCTOS DESTACADOS</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Descubre nuestros productos más populares y novedades
              </p>
            </div>
            <ProductGrid limit={8} />
          </div>
        </section>

        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
