import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, Heart, ChevronLeft, Minus, Plus, Camera } from "lucide-react";
import { toast } from "sonner";
import { isColorOption, getColorValue } from "@/lib/colors";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VirtualTryOn } from "@/components/VirtualTryOn";

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showTryOn, setShowTryOn] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  // Compute image URLs (safe even when product is null)
  const images = product?.images?.edges || [];
  const variants = product?.variants?.edges || [];
  const selectedVariant = variants[selectedVariantIndex]?.node;
  const variantImage = selectedVariant?.image?.url;
  const currentImage = variantImage || images[selectedImage]?.node?.url || null;
  const mainImage = images[0]?.node?.url;

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setLoading(true);
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [handle]);

  const price = selectedVariant?.price || product?.priceRange?.minVariantPrice;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl mb-4">Producto no encontrado</h1>
            <Button asChild>
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shopifyProduct: ShopifyProduct = { node: product };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    });

    toast.success("Agregado al carrito", {
      description: `${product.title} x${quantity}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a la tienda
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden relative">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={selectedVariant?.image?.altText || product.title}
                    className="w-full h-full object-contain transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === idx ? 'border-accent' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || ''}
                        className="w-full h-full object-contain bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-4xl md:text-5xl mb-4">{product.title}</h1>
                {price && (
                  <p className="text-3xl font-bold text-accent">
                    {price.currencyCode} {parseFloat(price.amount).toLocaleString('es-CO')}
                  </p>
                )}
              </div>

              {/* Variants */}
              <TooltipProvider>
                {product.options?.map((option) => {
                  const isColor = isColorOption(option.name);
                  
                  return (
                    <div key={option.name} className="space-y-3">
                      <label className="font-semibold">{option.name}</label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const variantIndex = variants.findIndex(v => 
                            v.node.selectedOptions?.some(opt => opt.name === option.name && opt.value === value)
                          );
                          const isSelected = selectedVariant?.selectedOptions?.some(
                            opt => opt.name === option.name && opt.value === value
                          );
                          const variant = variants[variantIndex]?.node;
                          const isAvailable = variant?.availableForSale !== false;
                          const colorValue = isColor ? getColorValue(value) : null;
                          
                          if (isColor && colorValue) {
                            return (
                              <Tooltip key={value}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => variantIndex >= 0 && setSelectedVariantIndex(variantIndex)}
                                    disabled={!isAvailable}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                                      isSelected 
                                        ? 'ring-2 ring-accent ring-offset-2' 
                                        : isAvailable
                                          ? 'hover:ring-2 hover:ring-accent/50 hover:ring-offset-1'
                                          : 'opacity-50 cursor-not-allowed'
                                    }`}
                                    style={{ backgroundColor: colorValue, borderColor: colorValue === '#FFFFFF' ? '#E5E7EB' : colorValue }}
                                  >
                                    {!isAvailable && (
                                      <span className="block w-full h-0.5 bg-destructive rotate-45 transform origin-center" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  {value}
                                </TooltipContent>
                              </Tooltip>
                            );
                          }
                          
                          return (
                            <button
                              key={value}
                              onClick={() => variantIndex >= 0 && setSelectedVariantIndex(variantIndex)}
                              disabled={!isAvailable}
                              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                isSelected 
                                  ? 'border-accent bg-accent text-accent-foreground' 
                                  : isAvailable
                                    ? 'border-border hover:border-accent'
                                    : 'border-border opacity-50 cursor-not-allowed line-through'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </TooltipProvider>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="font-semibold">Cantidad</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(q => q + 1)}
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Try On Button */}
              {mainImage && (
                <Button
                  onClick={() => setShowTryOn(true)}
                  variant="outline"
                  size="lg"
                  className="w-full border-accent text-accent hover:bg-accent/10"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Probador Virtual - Ver cómo te queda
                </Button>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading || !selectedVariant}
                  size="lg"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Agregar al Carrito
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="shrink-0">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-3">Descripción</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Virtual Try-On Modal */}
      {mainImage && (
        <VirtualTryOn
          isOpen={showTryOn}
          onClose={() => setShowTryOn(false)}
          productName={product.title}
          productImageUrl={mainImage}
        />
      )}
    </div>
  );
};

export default ProductPage;
