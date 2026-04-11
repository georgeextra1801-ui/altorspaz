import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2, Search } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const term = searchParams.get("q") || "";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!term.trim()) return;
    setLoading(true);
    fetchProducts(24, `title:*${term}*`)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [term]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Search className="h-6 w-6 text-primary-foreground/70" />
              <h1 className="font-display text-4xl md:text-5xl text-primary-foreground">
                BÚSQUEDA
              </h1>
            </div>
            {term && (
              <p className="text-primary-foreground/70 text-lg">
                Resultados para:{" "}
                <span className="text-accent font-semibold">"{term}"</span>
              </p>
            )}
          </div>
        </section>

        {/* Resultados */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
              </div>
            ) : !term.trim() ? (
              <div className="text-center py-20">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Escribe algo en el buscador para ver productos.
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-display text-3xl mb-2">Sin resultados</h2>
                <p className="text-muted-foreground">
                  No encontramos productos para{" "}
                  <span className="font-semibold">"{term}"</span>.
                </p>
                <Link
                  to="/"
                  className="inline-block mt-6 text-accent underline hover:text-accent/80"
                >
                  Ver todos los productos
                </Link>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm mb-6">
                  {products.length} resultado
                  {products.length !== 1 ? "s" : ""} para "{term}"
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
