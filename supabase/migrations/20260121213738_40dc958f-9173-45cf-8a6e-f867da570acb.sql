-- Create storage bucket for cached recolored product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recolored-products', 
  'recolored-products', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
);

-- Allow public read access to recolored images
CREATE POLICY "Public read access for recolored products"
ON storage.objects FOR SELECT
USING (bucket_id = 'recolored-products');

-- Allow edge functions to insert images (using service role)
CREATE POLICY "Service role can insert recolored products"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recolored-products');

-- Create a table to track cached recolors for fast lookups
CREATE TABLE public.recolored_product_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_image_hash TEXT NOT NULL,
  target_color TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_image_hash, target_color)
);

-- Enable RLS
ALTER TABLE public.recolored_product_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cache entries
CREATE POLICY "Public read access for cache"
ON public.recolored_product_cache FOR SELECT
USING (true);

-- Allow inserts from edge functions (anon key can insert)
CREATE POLICY "Allow insert to cache"
ON public.recolored_product_cache FOR INSERT
WITH CHECK (true);