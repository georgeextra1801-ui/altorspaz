import { useEffect, useState } from "react";
import { ShopifyProduct, fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  query?: string;
  limit?: number;
}

export const ProductGrid = ({ query, limit = 12 }: ProductGridProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts(limit, query);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [query, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <h3 className="font-display text-3xl mb-4">No hay productos aún</h3>
          <p className="text-muted-foreground mb-6">
            Puedes crear tu primer producto diciéndome qué producto quieres agregar y su precio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.node.id} product={product} />
      ))}
    </div>
  );
};
