-- Create a Power BI optimized view for orbital visualization
CREATE OR REPLACE VIEW satellite_orbital_view AS
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

-- Create an index on the satellites table for better query performance
CREATE INDEX IF NOT EXISTS idx_satellites_country ON satellites(country);
CREATE INDEX IF NOT EXISTS idx_satellites_type ON satellites(type);
CREATE INDEX IF NOT EXISTS idx_satellites_status ON satellites(status);

COMMENT ON VIEW satellite_orbital_view IS 'Optimized view for Power BI orbital visualization with calculated latitude, longitude, and orbital parameters';