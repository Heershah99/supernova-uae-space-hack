-- Fix security issues from previous migration

-- Recreate the view without SECURITY DEFINER (it should use SECURITY INVOKER by default)
DROP VIEW IF EXISTS satellite_orbital_view;

CREATE VIEW satellite_orbital_view 
WITH (security_invoker=true) AS
SELECT 
  id,
  name,
  type,
  country,
  status,
  altitude,
  inclination,
  period,
  position_x,
  position_y,
  position_z,
  velocity_x,
  velocity_y,
  velocity_z,
  battery_level,
  signal_strength,
  temperature,
  last_contact,
  created_at,
  updated_at,
  -- Calculate orbital speed (km/s)
  CASE 
    WHEN velocity_x IS NOT NULL AND velocity_y IS NOT NULL AND velocity_z IS NOT NULL
    THEN SQRT(POWER(velocity_x, 2) + POWER(velocity_y, 2) + POWER(velocity_z, 2))
    ELSE NULL
  END as orbital_speed,
  -- Calculate distance from Earth center (km)
  CASE 
    WHEN position_x IS NOT NULL AND position_y IS NOT NULL AND position_z IS NOT NULL
    THEN SQRT(POWER(position_x, 2) + POWER(position_y, 2) + POWER(position_z, 2))
    ELSE NULL
  END as distance_from_center,
  -- Calculate approximate latitude (degrees)
  CASE 
    WHEN position_x IS NOT NULL AND position_y IS NOT NULL AND position_z IS NOT NULL
    THEN DEGREES(ASIN(position_z / SQRT(POWER(position_x, 2) + POWER(position_y, 2) + POWER(position_z, 2))))
    ELSE NULL
  END as latitude,
  -- Calculate approximate longitude (degrees)
  CASE 
    WHEN position_x IS NOT NULL AND position_y IS NOT NULL
    THEN DEGREES(ATAN2(position_y, position_x))
    ELSE NULL
  END as longitude
FROM satellites
WHERE status = 'operational';

-- Grant access to the view
GRANT SELECT ON satellite_orbital_view TO authenticated;
GRANT SELECT ON satellite_orbital_view TO anon;

-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Fix search_path for handle_new_user function  
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Operator'),
    'operator'
  );
  RETURN NEW;
END;
$function$;