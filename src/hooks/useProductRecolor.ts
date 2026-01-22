import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecolorCache {
  [key: string]: string;
}

export function useProductRecolor() {
  const [isRecoloring, setIsRecoloring] = useState(false);
  const [recoloredImage, setRecoloredImage] = useState<string | null>(null);
  const cacheRef = useRef<RecolorCache>({});

  const recolorProduct = useCallback(async (
    productImageUrl: string,
    targetColor: string,
    productName: string
  ) => {
    // Create cache key
    const cacheKey = `${productImageUrl}-${targetColor}`;
    
    // Check cache first
    if (cacheRef.current[cacheKey]) {
      setRecoloredImage(cacheRef.current[cacheKey]);
      return cacheRef.current[cacheKey];
    }

    setIsRecoloring(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('recolor-product', {
        body: {
          productImageUrl,
          targetColor,
          productName
        }
      });

      if (error) throw error;

      if (data?.recoloredImageUrl) {
        // Cache the result
        cacheRef.current[cacheKey] = data.recoloredImageUrl;
        setRecoloredImage(data.recoloredImageUrl);
        return data.recoloredImageUrl;
      }

      throw new Error('No se generó imagen para ese color.');
    } catch (error) {
      console.error('Error recoloring product:', error);
      const message = error instanceof Error ? error.message : 'Error recoloreando producto';
      throw new Error(message);
    } finally {
      setIsRecoloring(false);
    }
  }, []);

  const resetRecolor = useCallback(() => {
    setRecoloredImage(null);
  }, []);

  return {
    isRecoloring,
    recoloredImage,
    recolorProduct,
    resetRecolor
  };
}
