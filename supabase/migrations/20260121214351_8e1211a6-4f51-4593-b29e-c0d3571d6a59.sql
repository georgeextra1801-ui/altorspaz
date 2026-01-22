-- Tighten RLS: remove overly-permissive INSERT policy on cache table
DROP POLICY IF EXISTS "Allow insert to cache" ON public.recolored_product_cache;

-- No INSERT policy needed: our backend function uses service role and bypasses RLS.
-- Keep public read-only access.
