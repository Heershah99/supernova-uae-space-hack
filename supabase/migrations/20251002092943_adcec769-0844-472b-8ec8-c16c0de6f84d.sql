-- Create table for Kp index and space weather data
CREATE TABLE public.space_weather (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  days INTEGER NOT NULL,
  days_midday NUMERIC NOT NULL,
  bartels_solar_rotation INTEGER NOT NULL,
  day_within_rotation INTEGER NOT NULL,
  -- Kp indices (8 three-hour periods)
  kp1 NUMERIC,
  kp2 NUMERIC,
  kp3 NUMERIC,
  kp4 NUMERIC,
  kp5 NUMERIC,
  kp6 NUMERIC,
  kp7 NUMERIC,
  kp8 NUMERIC,
  -- ap indices (8 three-hour periods)
  ap1 INTEGER,
  ap2 INTEGER,
  ap3 INTEGER,
  ap4 INTEGER,
  ap5 INTEGER,
  ap6 INTEGER,
  ap7 INTEGER,
  ap8 INTEGER,
  -- Daily values
  ap_daily INTEGER,
  sunspot_number INTEGER,
  f107_obs NUMERIC,
  f107_adj NUMERIC,
  data_quality INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(date)
);

-- Enable RLS
ALTER TABLE public.space_weather ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view space weather data
CREATE POLICY "Authenticated users can view space weather data"
ON public.space_weather
FOR SELECT
USING (true);

-- Only operators and admins can insert/update space weather data
CREATE POLICY "Operators and admins can insert space weather data"
ON public.space_weather
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'operator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Operators and admins can update space weather data"
ON public.space_weather
FOR UPDATE
USING (has_role(auth.uid(), 'operator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_space_weather_updated_at
BEFORE UPDATE ON public.space_weather
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster date queries
CREATE INDEX idx_space_weather_date ON public.space_weather(date DESC);