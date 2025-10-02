-- Drop the existing view
DROP VIEW IF EXISTS satellite_orbital_view;

-- Recreate the view with security barrier and access control
CREATE VIEW satellite_orbital_view
WITH (security_barrier = true)
AS
SELECT 
  s.id,
  s.name,
  s.type,
  s.country,
  s.status,
  s.altitude,
  s.inclination,
  s.period,
  s.position_x,
  s.position_y,
  s.position_z,
  s.velocity_x,
  s.velocity_y,
  s.velocity_z,
  s.battery_level,
  s.signal_strength,
  s.temperature,
  s.last_contact,
  s.created_at,
  s.updated_at,
  -- Calculated orbital metrics
  SQRT(POWER(s.position_x, 2) + POWER(s.position_y, 2) + POWER(s.position_z, 2)) as distance_from_center,
  SQRT(POWER(s.velocity_x, 2) + POWER(s.velocity_y, 2) + POWER(s.velocity_z, 2)) as orbital_speed,
  -- Calculate latitude and longitude from position
  DEGREES(ASIN(s.position_z / NULLIF(SQRT(POWER(s.position_x, 2) + POWER(s.position_y, 2) + POWER(s.position_z, 2)), 0))) as latitude,
  DEGREES(ATAN2(s.position_y, s.position_x)) as longitude
FROM satellites s
WHERE 
  -- Only show data to operators and admins
  has_role(auth.uid(), 'operator'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role);