-- Create storage bucket for debris detection images
INSERT INTO storage.buckets (id, name, public)
VALUES ('debris-images', 'debris-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for debris images bucket
CREATE POLICY "Authenticated users can view debris images"
ON storage.objects FOR SELECT
USING (bucket_id = 'debris-images' AND auth.role() = 'authenticated');

CREATE POLICY "Operators and admins can upload debris images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'debris-images' 
  AND auth.role() = 'authenticated'
  AND (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('operator', 'admin')
    )
  )
);

CREATE POLICY "Operators and admins can update debris images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'debris-images' 
  AND auth.role() = 'authenticated'
  AND (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('operator', 'admin')
    )
  )
);

CREATE POLICY "Admins can delete debris images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'debris-images' 
  AND auth.role() = 'authenticated'
  AND (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
);