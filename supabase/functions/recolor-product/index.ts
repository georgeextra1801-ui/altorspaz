/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for cache key
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productImageUrl, targetColor, productName } = await req.json();

    if (!productImageUrl || !targetColor) {
      return new Response(
        JSON.stringify({ error: "Missing productImageUrl or targetColor" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role for storage access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create a hash of the image URL for cache lookup
    const imageHash = simpleHash(productImageUrl);
    const normalizedColor = targetColor.toLowerCase().trim();

    // Check if we have a cached version
    const { data: cachedResult } = await supabase
      .from('recolored_product_cache')
      .select('public_url')
      .eq('product_image_hash', imageHash)
      .eq('target_color', normalizedColor)
      .single();

    if (cachedResult?.public_url) {
      console.log(`Cache hit for ${imageHash}-${normalizedColor}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          recoloredImageUrl: cachedResult.public_url,
          cached: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Cache miss for ${imageHash}-${normalizedColor}, generating...`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch the product image and convert to base64
    const imageResponse = await fetch(productImageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch product image");
    }

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000;
      let binary = "";
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    };
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = arrayBufferToBase64(imageBuffer);
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    // Use the image generation model to create a recolored version
    const response = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              },
              {
                type: "text",
                text: `Edit this clothing product photo. Change the fabric/garment color to ${targetColor}. Keep everything else exactly the same: the model's pose, the background, logos, seams, and all garment details. Make the new color look natural and photorealistic.`
              }
            ]
          }
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const result = await response.json();

    // Expected response format for image generation/edit:
    // data.choices[0].message.images[0].image_url.url -> data:image/png;base64,...
    const generatedImage = result.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

    if (!generatedImage) {
      console.error("Response structure:", JSON.stringify(result, null, 2));
      throw new Error("No image generated in response");
    }

    // Save to storage for caching
    try {
      // Extract base64 data from data URL
      const base64Match = generatedImage.match(/^data:image\/(\w+);base64,(.+)$/);
      if (base64Match) {
        const imageType = base64Match[1];
        const base64Data = base64Match[2];
        
        // Convert base64 to Uint8Array
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Upload to storage
        const fileName = `${imageHash}_${normalizedColor.replace(/\s+/g, '-')}.${imageType}`;
        const { error: uploadError } = await supabase.storage
          .from('recolored-products')
          .upload(fileName, bytes, {
            contentType: `image/${imageType}`,
            upsert: true
          });

        if (!uploadError) {
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('recolored-products')
            .getPublicUrl(fileName);

          if (publicUrlData?.publicUrl) {
            // Save to cache table
            await supabase
              .from('recolored_product_cache')
              .upsert({
                product_image_hash: imageHash,
                target_color: normalizedColor,
                storage_path: fileName,
                public_url: publicUrlData.publicUrl
              }, {
                onConflict: 'product_image_hash,target_color'
              });

            console.log(`Cached recolored image: ${fileName}`);

            // Return the permanent URL instead of base64
            return new Response(
              JSON.stringify({ 
                success: true, 
                recoloredImageUrl: publicUrlData.publicUrl,
                cached: false
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } else {
          console.error("Upload error:", uploadError);
        }
      }
    } catch (cacheError) {
      console.error("Error caching image:", cacheError);
      // Continue and return the base64 image even if caching fails
    }

    // Fallback: return base64 if caching failed
    return new Response(
      JSON.stringify({ 
        success: true, 
        recoloredImageUrl: generatedImage,
        cached: false
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in recolor-product:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
