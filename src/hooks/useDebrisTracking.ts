import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DebrisObject {
  id: string;
  name: string;
  type: 'debris' | 'rocket_body' | 'defunct_satellite';
  altitude: number;
  position_x: number;
  position_y: number;
  position_z: number;
  velocity_x: number;
  velocity_y: number;
  velocity_z: number;
  size: number; // in meters
  mass?: number; // in kg
  last_updated: string;
}

export interface CollisionRisk {
  id: string;
  satellite_id: string;
  satellite_name: string;
  debris_id: string;
  debris_name: string;
  probability: number;
  closest_approach: Date;
  miss_distance: number; // in km
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  relative_velocity: number; // in km/s
}

export const useDebrisTracking = () => {
  const [debris, setDebris] = useState<DebrisObject[]>([]);
  const [collisionRisks, setCollisionRisks] = useState<CollisionRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const generateDebrisData = useCallback(() => {
    // Generate simulated debris objects in various orbits
    const debrisTypes: Array<DebrisObject['type']> = ['debris', 'rocket_body', 'defunct_satellite'];
    const generatedDebris: DebrisObject[] = [];

    for (let i = 0; i < 50; i++) {
      const altitude = 400 + Math.random() * 1000; // LEO debris
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.random() * Math.PI;
      const r = 6371 + altitude;

      generatedDebris.push({
        id: `debris-${i}`,
        name: `Debris-${i.toString().padStart(4, '0')}`,
        type: debrisTypes[Math.floor(Math.random() * debrisTypes.length)],
        altitude,
        position_x: r * Math.sin(phi) * Math.cos(theta),
        position_y: r * Math.sin(phi) * Math.sin(theta),
        position_z: r * Math.cos(phi),
        velocity_x: -7.5 * Math.sin(theta) + (Math.random() - 0.5) * 2,
        velocity_y: 7.5 * Math.cos(theta) + (Math.random() - 0.5) * 2,
        velocity_z: (Math.random() - 0.5) * 1,
        size: Math.random() * 5 + 0.1,
        mass: Math.random() * 1000 + 10,
        last_updated: new Date().toISOString()
      });
    }

    setDebris(generatedDebris);
    setLoading(false);
  }, []);

  const calculateCollisionRisks = useCallback(async () => {
    setAnalyzing(true);
    try {
      // Fetch active satellites
      const { data: satellites, error } = await supabase
        .from('satellites')
        .select('*')
        .eq('status', 'operational');

      if (error) throw error;

      const risks: CollisionRisk[] = [];

      // Calculate collision probabilities
      satellites?.forEach(sat => {
        if (!sat.position_x || !sat.position_y || !sat.position_z) return;

        debris.forEach(deb => {
          // Calculate distance
          const dx = sat.position_x - deb.position_x;
          const dy = sat.position_y - deb.position_y;
          const dz = sat.position_z - deb.position_z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Calculate relative velocity
          const dvx = (sat.velocity_x || 0) - deb.velocity_x;
          const dvy = (sat.velocity_y || 0) - deb.velocity_y;
          const dvz = (sat.velocity_z || 0) - deb.velocity_z;
          const relativeVelocity = Math.sqrt(dvx * dvx + dvy * dvy + dvz * dvz);

          // If objects are close (within 100 km)
          if (distance < 100) {
            // Calculate closest approach time (simplified)
            const closestApproachHours = Math.random() * 24 + 1;
            const closestApproach = new Date(Date.now() + closestApproachHours * 3600000);

            // Calculate miss distance
            const missDistance = distance - (relativeVelocity * closestApproachHours / 10);
            
            // Calculate probability based on distance and velocity
            const probability = Math.max(0, Math.min(100, 
              100 * (1 - missDistance / 50) * (relativeVelocity / 15)
            ));

            let threatLevel: CollisionRisk['threat_level'] = 'low';
            if (probability > 70) threatLevel = 'critical';
            else if (probability > 50) threatLevel = 'high';
            else if (probability > 25) threatLevel = 'medium';

            if (probability > 10) {
              risks.push({
                id: `risk-${sat.id}-${deb.id}`,
                satellite_id: sat.id,
                satellite_name: sat.name,
                debris_id: deb.id,
                debris_name: deb.name,
                probability,
                closest_approach: closestApproach,
                miss_distance: Math.max(0.1, missDistance),
                threat_level: threatLevel,
                relative_velocity: relativeVelocity
              });
            }
          }
        });
      });

      // Sort by probability
      risks.sort((a, b) => b.probability - a.probability);
      setCollisionRisks(risks.slice(0, 20)); // Keep top 20 risks

      // Store critical risks in database
      const criticalRisks = risks.filter(r => r.threat_level === 'critical' || r.threat_level === 'high');
      for (const risk of criticalRisks.slice(0, 5)) {
        await supabase.from('collision_predictions').insert({
          satellite1_id: risk.satellite_id,
          probability: risk.probability,
          predicted_time: risk.closest_approach.toISOString(),
          miss_distance: risk.miss_distance,
          threat_level: risk.threat_level
        });
      }

      if (criticalRisks.length > 0) {
        toast.warning(`${criticalRisks.length} critical collision risks detected!`);
      }
    } catch (error) {
      console.error('Error calculating collision risks:', error);
      toast.error('Failed to calculate collision risks');
    } finally {
      setAnalyzing(false);
    }
  }, [debris]);

  useEffect(() => {
    generateDebrisData();
  }, [generateDebrisData]);

  useEffect(() => {
    if (debris.length > 0) {
      calculateCollisionRisks();
      const interval = setInterval(calculateCollisionRisks, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [debris, calculateCollisionRisks]);

  return {
    debris,
    collisionRisks,
    loading,
    analyzing,
    refetch: calculateCollisionRisks
  };
};
