-- Políticas de storage para los buckets existentes (hero-banners, campaign-banners) que admins puedan subir/borrar
DO $$
BEGIN
  -- hero-banners: lectura pública, escritura admin
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public read hero-banners') THEN
    CREATE POLICY "Public read hero-banners" ON storage.objects FOR SELECT USING (bucket_id = 'hero-banners');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins write hero-banners') THEN
    CREATE POLICY "Admins write hero-banners" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'hero-banners' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins update hero-banners') THEN
    CREATE POLICY "Admins update hero-banners" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'hero-banners' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins delete hero-banners') THEN
    CREATE POLICY "Admins delete hero-banners" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'hero-banners' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  -- campaign-banners
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public read campaign-banners') THEN
    CREATE POLICY "Public read campaign-banners" ON storage.objects FOR SELECT USING (bucket_id = 'campaign-banners');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins write campaign-banners') THEN
    CREATE POLICY "Admins write campaign-banners" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'campaign-banners' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins update campaign-banners') THEN
    CREATE POLICY "Admins update campaign-banners" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'campaign-banners' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins delete campaign-banners') THEN
    CREATE POLICY "Admins delete campaign-banners" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'campaign-banners' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  -- inventory-files (privado, solo admin)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins read inventory-files') THEN
    CREATE POLICY "Admins read inventory-files" ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'inventory-files' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins write inventory-files') THEN
    CREATE POLICY "Admins write inventory-files" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'inventory-files' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END$$;