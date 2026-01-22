import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { SportFilter, buildSportQuery } from "@/components/SportFilter";

// Category banner images
import mujeresBanner from "@/assets/category-banner-mujeres.png";
import hombresBanner from "@/assets/category-banner-hombres.png";

const categoryBanners: Record<string, string> = {
  "MUJERES": mujeresBanner,
  "HOMBRES": hombresBanner,
};

const CategoryPage = ({ 
  title, 
  description, 
  baseQuery 
}: { 
  title: string; 
  description: string; 
  baseQuery?: string 
}) => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  
  const finalQuery = buildSportQuery(baseQuery, selectedSports);
  const bannerImage = categoryBanners[title];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Category Hero */}
        <section className="relative bg-primary py-16 overflow-hidden">
          {/* Background image */}
          {bannerImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${bannerImage})` }}
            />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-primary/60" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-display text-5xl md:text-7xl text-primary-foreground mb-4">
              {title}
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </section>

        {/* Sport Filter + Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SportFilter 
              selectedSports={selectedSports} 
              onSportsChange={setSelectedSports} 
            />
            <ProductGrid query={finalQuery} limit={20} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export const MujeresPage = () => (
  <CategoryPage 
    title="MUJERES" 
    description="Licras, shorts, buzos y más para entrenar con estilo" 
    baseQuery="tag:mujeres OR tag:women"
  />
);

export const HombresPage = () => (
  <CategoryPage 
    title="HOMBRES" 
    description="Ropa deportiva premium para hombres" 
    baseQuery="tag:hombres OR tag:men"
  />
);

export const NinosPage = () => (
  <CategoryPage 
    title="NIÑOS" 
    description="Moda deportiva para los más pequeños de la casa" 
    baseQuery="tag:ninos OR tag:kids"
  />
);

export const OfertasPage = () => (
  <CategoryPage 
    title="OFERTAS" 
    description="Aprovecha nuestras mejores ofertas y descuentos" 
    baseQuery="tag:sale OR tag:oferta"
  />
);
