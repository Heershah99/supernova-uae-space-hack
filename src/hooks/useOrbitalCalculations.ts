import { useEffect, useState } from "react";
import * as satellite from "satellite.js";
import { Satellite } from "./useSatellites";

export interface OrbitalData {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  altitude: number;
  latitude: number;
  longitude: number;
  orbitalPeriod: number;
  nextPass?: Date;
}

export const useOrbitalCalculations = (satellites: Satellite[]) => {
  const [orbitalData, setOrbitalData] = useState<Map<string, OrbitalData>>(new Map());

  useEffect(() => {
    const calculateOrbits = () => {
      const newOrbitalData = new Map<string, OrbitalData>();
      const now = new Date();

      satellites.forEach((sat) => {
        try {
          // Use existing position data or generate from orbital parameters
          if (sat.position_x && sat.position_y && sat.position_z) {
            // Calculate altitude from position vector
            const altitude = Math.sqrt(
              sat.position_x ** 2 + sat.position_y ** 2 + sat.position_z ** 2
            ) - 6371; // Earth radius in km

            // Calculate velocity (simplified circular orbit approximation)
            const mu = 398600.4418; // Earth's gravitational parameter (km³/s²)
            const r = altitude + 6371;
            const v = Math.sqrt(mu / r);

            // Calculate orbital period (seconds)
            const orbitalPeriod = 2 * Math.PI * Math.sqrt((r ** 3) / mu);

            // Convert position to lat/lon
            const lat = Math.asin(sat.position_z / r) * (180 / Math.PI);
            const lon = Math.atan2(sat.position_y, sat.position_x) * (180 / Math.PI);

            newOrbitalData.set(sat.id, {
              position: {
                x: sat.position_x,
                y: sat.position_y,
                z: sat.position_z,
              },
              velocity: {
                x: sat.velocity_x || (-sat.position_y * v) / r,
                y: sat.velocity_y || (sat.position_x * v) / r,
                z: sat.velocity_z || 0,
              },
              altitude,
              latitude: lat,
              longitude: lon,
              orbitalPeriod: orbitalPeriod / 60, // Convert to minutes
            });
          } else if (sat.altitude && sat.inclination) {
            // Generate position from orbital parameters
            const a = sat.altitude + 6371; // Semi-major axis
            const i = (sat.inclination * Math.PI) / 180; // Inclination in radians
            
            // Random orbital position for demonstration
            const theta = (Date.now() / 1000) % (2 * Math.PI);
            
            const x = a * Math.cos(theta);
            const y = a * Math.sin(theta) * Math.cos(i);
            const z = a * Math.sin(theta) * Math.sin(i);

            const mu = 398600.4418;
            const v = Math.sqrt(mu / a);
            const orbitalPeriod = 2 * Math.PI * Math.sqrt((a ** 3) / mu);

            const lat = Math.asin(z / a) * (180 / Math.PI);
            const lon = Math.atan2(y, x) * (180 / Math.PI);

            newOrbitalData.set(sat.id, {
              position: { x, y, z },
              velocity: {
                x: (-y * v) / a,
                y: (x * v) / a,
                z: 0,
              },
              altitude: sat.altitude,
              latitude: lat,
              longitude: lon,
              orbitalPeriod: orbitalPeriod / 60,
            });
          }
        } catch (error) {
          console.error(`Error calculating orbit for ${sat.name}:`, error);
        }
      });

      setOrbitalData(newOrbitalData);
    };

    calculateOrbits();
    const interval = setInterval(calculateOrbits, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [satellites]);

  return orbitalData;
};
