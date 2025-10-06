-- Create storage bucket for debris detection images
INSERT INTO storage.buckets (id, name, public)
VALUES ('debris-detections', 'debris-detections', true);

-- Create RLS policies for debris-detections bucket
CREATE POLICY "Anyone can view debris detection images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'debris-detections');

CREATE POLICY "Authenticated users can upload debris detection images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'debris-detections' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update their debris detection images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'debris-detections' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete debris detection images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'debris-detections' AND auth.role() = 'authenticated');