import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isColorOption } from "@/lib/colors";
import { getSwatchImageForOptionValue } from "@/lib/product-swatches";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  
  const { node } = product;
  const image = node.images?.edges?.[0]?.node;
  const price = node.priceRange?.minVariantPrice;
  const firstVariant = node.variants?.edges?.[0]?.node;
  const colorOption = node.options?.find(opt => isColorOption(opt.name));

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;
    
    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    });

    toast.success("Agregado al carrito", {
      description: node.title,
    });
  };

  return (
    <Link to={`/producto/${node.handle}`} className="group block">
      {/* Product image container with fixed aspect ratio and gray transparency */}
      <div className="relative aspect-square bg-gray-300/40 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-muted-foreground">Sin imagen</span>
          )}
        </div>
        
        {/* Hover overlay with actions */}
        <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center p-4">
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading || !firstVariant}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Agregar
                </>
              )}
            </Button>
            <Button variant="secondary" size="icon" className="shrink-0 shadow-lg">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Color options preview */}
        {colorOption?.values && (
          <div className="absolute bottom-2 left-2 right-2 opacity-100 group-hover:opacity-0 transition-opacity">
            <TooltipProvider>
              <div className="flex gap-1.5 justify-center flex-wrap">
                {colorOption.values.slice(0, 6).map((value, idx) => {
                    const { imageUrl, altText } = getSwatchImageForOptionValue({
                      variants: node.variants?.edges || [],
                      optionName: colorOption.name,
                      value,
                      fallbackImageUrl: image?.url,
                      fallbackAltText: image?.altText || node.title,
                    });

                    return imageUrl ? (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <span className="w-8 h-8 rounded-full overflow-hidden border-2 border-background shadow-md cursor-pointer bg-background">
                            <img
                              src={imageUrl}
                              alt={altText}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {value}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span key={idx} className="text-xs bg-background/80 backdrop-blur px-2 py-0.5 rounded shadow">
                        {value}
                      </span>
                    );
                  })}
              </div>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {node.title}
        </h3>
        {price && (
          <p className="font-bold text-lg">
            {price.currencyCode} {parseFloat(price.amount).toLocaleString('es-CO')}
          </p>
        )}
      </div>
    </Link>
  );
};
