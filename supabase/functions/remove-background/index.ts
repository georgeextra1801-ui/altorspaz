import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productImageUrl } = await req.json();

    if (!productImageUrl) {
      return new Response(
        JSON.stringify({ error: "productImageUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache first
    const imageHash = simpleHash(productImageUrl);
    const cacheKey = `nobg_${imageHash}`;

    const { data: cached } = await supabase
      .from("recolored_product_cache")
      .select("public_url")
      .eq("product_image_hash", imageHash)
      .eq("target_color", "no-background")
      .maybeSingle();

    if (cached?.public_url) {
      console.log("Cache hit for background removal:", cacheKey);
      return new Response(
        JSON.stringify({ imageUrl: cached.public_url, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Cache miss, removing background via AI...");

    // Fetch the original image
    const imageResponse = await fetch(productImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = arrayBufferToBase64(imageBuffer);
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    // Use AI to remove background
    const response = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        modalities: ["image", "text"],
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
                text: "Remove the background from this product image completely. Keep ONLY the clothing item/product with perfect edges. The result should have a transparent or pure white (#FFFFFF) background. Preserve all product details, colors, textures, and quality. Output a clean product-only image suitable for e-commerce."
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      // Return original image gracefully instead of throwing
      return new Response(
        JSON.stringify({ 
          imageUrl: productImageUrl, 
          error: response.status === 402 ? "No hay créditos suficientes" : "Error del servicio AI",
          status: response.status 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      console.error("No image in AI response:", JSON.stringify(data));
      // Return original image if AI fails
      return new Response(
        JSON.stringify({ imageUrl: productImageUrl, error: "AI did not return image" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract base64 data and upload to storage
    const base64Data = generatedImageUrl.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const storagePath = `nobg/${cacheKey}.png`;
    const { error: uploadError } = await supabase.storage
      .from("recolored-products")
      .upload(storagePath, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // Return the base64 image directly if storage fails
      return new Response(
        JSON.stringify({ imageUrl: generatedImageUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("recolored-products")
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // Save to cache
    await supabase.from("recolored_product_cache").insert({
      product_image_hash: imageHash,
      target_color: "no-background",
      storage_path: storagePath,
      public_url: publicUrl,
    });

    console.log("Background removed and cached:", publicUrl);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in remove-background:", error);
    // Return success with error info to avoid runtime error overlay
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error", status: 500 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
