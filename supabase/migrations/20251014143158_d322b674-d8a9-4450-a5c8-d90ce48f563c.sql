-- Update RLS policies to allow authenticated users to insert demo data
-- This enables the demo data generation functionality

-- Update debris_detections policies
DROP POLICY IF EXISTS "Operators and admins can insert debris detections" ON debris_detections;
CREATE POLICY "Authenticated users can insert debris detections"
ON debris_detections
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Update collision_predictions policies
DROP POLICY IF EXISTS "Authenticated users can insert collision predictions" ON collision_predictions;
CREATE POLICY "Authenticated users can insert collision predictions"
ON collision_predictions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Ensure alerts and threats have proper insert policies (already in place but verify)
DROP POLICY IF EXISTS "Authenticated users can insert alerts" ON alerts;
CREATE POLICY "Authenticated users can insert alerts"
ON alerts
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can insert threats" ON threats;
CREATE POLICY "Authenticated users can insert threats"
ON threats
FOR INSERT
TO authenticated
WITH CHECK (true);