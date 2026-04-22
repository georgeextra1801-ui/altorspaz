import { useEffect, useState, useRef } from "react";
import { ShopifyProduct, fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export const OffersCarousel = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts(20, "tag:carrusel_home");
        setProducts(data);
      } catch (e) {
        console.error("Error loading offers carousel:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      </section>
    );
  }

  if (products.length === 0) return null;

  // Triplicar para efecto continuo visual
  const displayed = [...products, ...products, ...products];

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <span className="inline-block bg-background px-4 py-1 rounded-full text-xs tracking-widest font-semibold mb-4">
          PRODUCTOS
        </span>
        <h2 className="font-display text-4xl md:text-5xl mb-3">PRINCIPALES</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto uppercase text-sm tracking-wide">
          Caracterizados por nuestras prestaciones de protección en nuestros productos
        </p>
      </div>

      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg hidden md:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 md:px-12 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayed.map((product, idx) => (
            <div
              key={`${product.node.id}-${idx}`}
              className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[16%] snap-start relative"
            >
              <div className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                -30%
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg hidden md:flex"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};
