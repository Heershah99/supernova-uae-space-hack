-- Create debris_detections table for AI-detected space debris
CREATE TABLE public.debris_detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_name TEXT NOT NULL,
  image_url TEXT,
  x1 NUMERIC NOT NULL,
  y1 NUMERIC NOT NULL,
  x2 NUMERIC NOT NULL,
  y2 NUMERIC NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  detection_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  debris_type TEXT,
  linked_debris_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.debris_detections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view debris detections"
  ON public.debris_detections
  FOR SELECT
  USING (true);

CREATE POLICY "Operators and admins can insert debris detections"
  ON public.debris_detections
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'operator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Operators and admins can update debris detections"
  ON public.debris_detections
  FOR UPDATE
  USING (has_role(auth.uid(), 'operator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete debris detections"
  ON public.debris_detections
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_debris_detections_updated_at
  BEFORE UPDATE ON public.debris_detections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_debris_detections_confidence ON public.debris_detections(confidence DESC);
CREATE INDEX idx_debris_detections_detection_time ON public.debris_detections(detection_time DESC);