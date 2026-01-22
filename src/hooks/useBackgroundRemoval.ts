import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseBackgroundRemovalResult {
  processedImageUrl: string | null;
  isProcessing: boolean;
  error: string | null;
}

export function useBackgroundRemoval(originalImageUrl: string | null | undefined): UseBackgroundRemovalResult {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originalImageUrl) {
      setProcessedImageUrl(null);
      return;
    }

    const removeBackground = async () => {
      setIsProcessing(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("remove-background", {
          body: { productImageUrl: originalImageUrl },
        });

        if (fnError) {
          console.error("Background removal error:", fnError);
          setError(fnError.message);
          setProcessedImageUrl(originalImageUrl); // Fallback to original
          return;
        }

        // Handle graceful error responses (402, 500, etc.)
        if (data?.error || data?.status) {
          console.warn("Background removal warning:", data.error);
          setProcessedImageUrl(data.imageUrl || originalImageUrl); // Use fallback from response or original
          return;
        }

        if (data?.imageUrl) {
          setProcessedImageUrl(data.imageUrl);
        } else {
          setProcessedImageUrl(originalImageUrl); // Fallback to original
        }
      } catch (err) {
        console.error("Background removal failed:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setProcessedImageUrl(originalImageUrl); // Fallback to original
      } finally {
        setIsProcessing(false);
      }
    };

    removeBackground();
  }, [originalImageUrl]);

  return { processedImageUrl, isProcessing, error };
}
