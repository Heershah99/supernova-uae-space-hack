import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const generateDemoData = async () => {
  try {
    // Generate UAE satellites
    const uaeSatellites = [
      {
        name: "KhalifaSat",
        type: "Earth Observation",
        country: "UAE",
        status: "operational" as const,
        altitude: 613,
        inclination: 97.8,
        battery_level: 92,
        signal_strength: 88,
        temperature: 21,
        position_x: 4821.3,
        position_y: -1234.7,
        position_z: 4521.8,
        velocity_x: -1.2,
        velocity_y: 5.8,
        velocity_z: 4.2
      },
      {
        name: "DubaiSat-1",
        type: "Remote Sensing",
        country: "UAE",
        status: "operational" as const,
        altitude: 680,
        inclination: 98.2,
        battery_level: 85,
        signal_strength: 91,
        temperature: 19,
        position_x: 5120.4,
        position_y: -987.2,
        position_z: 4823.1,
        velocity_x: -1.5,
        velocity_y: 6.1,
        velocity_z: 3.9
      },
      {
        name: "Hope Mars Mission",
        type: "Interplanetary",
        country: "UAE",
        status: "operational" as const,
        altitude: 22000,
        inclination: 0,
        battery_level: 94,
        signal_strength: 76,
        temperature: -45,
        position_x: 15234.2,
        position_y: 8921.5,
        position_z: 12453.7,
        velocity_x: -2.1,
        velocity_y: 3.4,
        velocity_z: 1.8
      }
    ];

    // Generate international satellites
    const internationalSatellites = [
      {
        name: "ISS",
        type: "Space Station",
        country: "International",
        status: "operational" as const,
        altitude: 408,
        inclination: 51.6,
        battery_level: 87,
        signal_strength: 95,
        temperature: 22,
        position_x: 4521.2,
        position_y: 2134.8,
        position_z: 3921.4,
        velocity_x: -5.2,
        velocity_y: 3.8,
        velocity_z: 4.1
      },
      {
        name: "Hubble Space Telescope",
        type: "Observatory",
        country: "USA",
        status: "operational" as const,
        altitude: 547,
        inclination: 28.5,
        battery_level: 79,
        signal_strength: 82,
        temperature: 18,
        position_x: 4892.5,
        position_y: 1823.4,
        position_z: 4234.9,
        velocity_x: -4.8,
        velocity_y: 4.2,
        velocity_z: 3.6
      },
      {
        name: "Sentinel-1A",
        type: "Earth Observation",
        country: "ESA",
        status: "operational" as const,
        altitude: 693,
        inclination: 98.18,
        battery_level: 91,
        signal_strength: 89,
        temperature: 20,
        position_x: 5234.1,
        position_y: -1456.7,
        position_z: 4923.2,
        velocity_x: -1.4,
        velocity_y: 6.0,
        velocity_z: 4.0
      }
    ];

    // Insert satellites
    const allSatellites = [...uaeSatellites, ...internationalSatellites];
    await supabase.from('satellites').upsert(allSatellites, { onConflict: 'name' });

    // Generate emergency alerts
    const alerts = [
      {
        title: "High Collision Risk - KhalifaSat",
        description: "Debris object approaching within 2km. Immediate attention required.",
        type: "collision_warning",
        severity: "critical" as const,
        affected_assets: ["KhalifaSat"],
        status: "active" as const,
        auto_response: "Automated collision avoidance maneuver initiated. Station operators notified."
      },
      {
        title: "Solar Storm Warning",
        description: "G3-class geomagnetic storm expected in 12 hours. Satellite systems may experience disruptions.",
        type: "space_weather",
        severity: "high" as const,
        affected_assets: ["All LEO satellites"],
        status: "active" as const,
        auto_response: "All satellites switched to safe mode. Non-essential systems powered down."
      },
      {
        title: "Signal Degradation - DubaiSat-1",
        description: "Signal strength dropped to 75%. Ground station communication affected.",
        type: "system_anomaly",
        severity: "medium" as const,
        affected_assets: ["DubaiSat-1"],
        status: "acknowledged" as const,
        auto_response: "Backup ground station activated. Diagnostics running."
      }
    ];

    await supabase.from('alerts').insert(alerts);

    // Generate debris detections
    const detections = [
      {
        image_name: "leo-sector-alpha-001.jpg",
        x1: 150,
        y1: 200,
        x2: 250,
        y2: 300,
        confidence: 0.94,
        debris_type: "rocket_body",
        notes: "Large debris fragment detected in LEO corridor"
      },
      {
        image_name: "leo-sector-alpha-001.jpg",
        x1: 400,
        y1: 150,
        x2: 450,
        y2: 200,
        confidence: 0.87,
        debris_type: "defunct_satellite",
        notes: "Inactive satellite component"
      },
      {
        image_name: "leo-sector-beta-002.jpg",
        x1: 100,
        y1: 300,
        x2: 180,
        y2: 380,
        confidence: 0.91,
        debris_type: "debris",
        notes: "Small debris cluster"
      }
    ];

    await supabase.from('debris_detections').insert(detections);

    toast.success("Demo data generated successfully! 🚀");
    
    // Refresh the page to show new data
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    
  } catch (error: any) {
    console.error("Error generating demo data:", error);
    toast.error("Failed to generate demo data: " + error.message);
  }
};
