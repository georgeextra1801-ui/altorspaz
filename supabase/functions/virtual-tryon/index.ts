import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhotoBase64, productImageUrl, productName } = await req.json();

    if (!userPhotoBase64 || !productImageUrl) {
      return new Response(
        JSON.stringify({ error: "Se requiere foto del usuario e imagen del producto" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing virtual try-on for product:", productName);

    // Prepare user image
    const userImageData = userPhotoBase64.startsWith('data:') 
      ? userPhotoBase64
      : `data:image/jpeg;base64,${userPhotoBase64}`;

    // Fetch product image and convert to base64 data URL
    const productImageResponse = await fetch(productImageUrl);
    if (!productImageResponse.ok) {
      return new Response(
        JSON.stringify({ error: "No se pudo descargar la imagen del producto." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const productImageBuffer = await productImageResponse.arrayBuffer();
    const productImageBase64 = btoa(
      new Uint8Array(productImageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    const productImageMimeType = productImageResponse.headers.get('content-type') || 'image/jpeg';
    const productImageDataUrl = `data:${productImageMimeType};base64,${productImageBase64}`;

    const promptText = `You are a professional virtual clothing try-on system. Your task is to generate a photorealistic image of the person in the first photo wearing the clothing item shown in the second image.

Product: ${productName}

Instructions:
1. Analyze the person's body shape, pose, and proportions from the first image
2. Identify the clothing item in the second image
3. Generate a new image showing the person realistically wearing this exact garment

Requirements:
- Preserve the person's face, skin tone, hair, and body type exactly
- Fit the clothing naturally to their body proportions
- Match the original photo's lighting, shadows, and background
- The result must look like an authentic photograph, not a composite
- Maintain the clothing's exact colors, patterns, and style details`;

    // Call Lovable AI Gateway with image generation model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: promptText },
              { type: "image_url", image_url: { url: userImageData } },
              { type: "image_url", image_url: { url: productImageDataUrl } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            ok: false,
            status: 429,
            error: "Demasiadas solicitudes. Por favor intenta de nuevo en unos minutos.",
            retryAfterSeconds: 60,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            ok: false,
            status: 402,
            error: "Créditos insuficientes. Por favor agrega fondos a tu workspace de Lovable.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Lovable AI response received successfully");

    // Extract image from Lovable AI response format
    const imageUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const responseText = data?.choices?.[0]?.message?.content;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({
          ok: false,
          status: 500,
          error: "No se pudo generar la imagen. Por favor intenta con otra foto.",
          details: responseText || "Sin detalles adicionales",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        resultImage: imageUrl,
        message: responseText || "¡Aquí puedes ver cómo te quedaría la prenda!",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Virtual try-on error:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        status: 500,
        error: error instanceof Error ? error.message : "Error desconocido",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});