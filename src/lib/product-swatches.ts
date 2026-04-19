import { ShopifyProduct } from "@/lib/shopify";

type ShopifyVariantEdge = ShopifyProduct["node"]["variants"]["edges"][number];

interface SwatchImageOptions {
  variants: ShopifyVariantEdge[];
  optionName: string;
  value: string;
  fallbackImageUrl?: string | null;
  fallbackAltText?: string | null;
}

export const getVariantIndexForOptionValue = (
  variants: ShopifyVariantEdge[],
  optionName: string,
  value: string,
): number => {
  return variants.findIndex(({ node }) =>
    node.selectedOptions?.some((option) => option.name === optionName && option.value === value),
  );
};

export const getSwatchImageForOptionValue = ({
  variants,
  optionName,
  value,
  fallbackImageUrl,
  fallbackAltText,
}: SwatchImageOptions) => {
  const variantIndex = getVariantIndexForOptionValue(variants, optionName, value);
  const variant = variantIndex >= 0 ? variants[variantIndex]?.node : undefined;

  return {
    variantIndex,
    imageUrl: variant?.image?.url ?? fallbackImageUrl ?? null,
    altText: variant?.image?.altText || variant?.title || fallbackAltText || value,
  };
};