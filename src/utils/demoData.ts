import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import debrisLeoAlpha from "@/assets/debris-leo-alpha-001.jpg";
import debrisLeoBeta from "@/assets/debris-leo-beta-002.jpg";
import debrisGeoGamma from "@/assets/debris-geo-gamma-003.jpg";

export const generateDemoData = async () => {
  try {
    // Clear existing demo data first
    await supabase.from('debris_detections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('alerts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('collision_predictions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('threats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Generate UAE satellites - comprehensive fleet
    const uaeSatellites = [
      {
        name: "KhalifaSat",
        type: "Earth Observation",
        country: "UAE",
        status: "operational" as const,
        altitude: 613,
        inclination: 97.8,
        battery_level: 95,
        signal_strength: 98,
        temperature: -15,
        position_x: 4821.3,
        position_y: -1234.7,
        position_z: 4521.8,
        velocity_x: -1.2,
        velocity_y: 5.8,
        velocity_z: 4.2
      },
      {
        name: "MBZ-SAT",
        type: "Earth Observation",
        country: "UAE",
        status: "operational" as const,
        altitude: 550,
        inclination: 97.5,
        battery_level: 92,
        signal_strength: 96,
        temperature: -12,
        position_x: 4650.8,
        position_y: -1145.3,
        position_z: 4412.6,
        velocity_x: -1.3,
        velocity_y: 5.9,
        velocity_z: 4.1
      },
      {
        name: "DubaiSat-1",
        type: "Remote Sensing",
        country: "UAE",
        status: "operational" as const,
        altitude: 680,
        inclination: 98.2,
        battery_level: 88,
        signal_strength: 94,
        temperature: -18,
        position_x: 5120.4,
        position_y: -987.2,
        position_z: 4823.1,
        velocity_x: -1.5,
        velocity_y: 6.1,
        velocity_z: 3.9
      },
      {
        name: "Nayif-1",
        type: "CubeSat",
        country: "UAE",
        status: "maintenance" as const,
        altitude: 520,
        inclination: 97.3,
        battery_level: 72,
        signal_strength: 85,
        temperature: -10,
        position_x: 4423.7,
        position_y: -1298.4,
        position_z: 4189.3,
        velocity_x: -1.1,
        velocity_y: 5.7,
        velocity_z: 4.3
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

    // Generate international satellites - diverse fleet
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
      },
      {
        name: "Starlink-1234",
        type: "Communication",
        country: "USA",
        status: "operational" as const,
        altitude: 550,
        inclination: 53.0,
        battery_level: 84,
        signal_strength: 91,
        temperature: 15,
        position_x: 4689.3,
        position_y: -1123.8,
        position_z: 4445.7,
        velocity_x: -1.3,
        velocity_y: 5.9,
        velocity_z: 4.0
      },
      {
        name: "GSAT-30",
        type: "Communication",
        country: "India",
        status: "operational" as const,
        altitude: 35786,
        inclination: 0.1,
        battery_level: 89,
        signal_strength: 87,
        temperature: -8,
        position_x: 28456.1,
        position_y: 15234.5,
        position_z: 8923.4,
        velocity_x: -3.1,
        velocity_y: 1.2,
        velocity_z: 0.5
      },
      {
        name: "Tiangong Space Station",
        type: "Space Station",
        country: "China",
        status: "operational" as const,
        altitude: 380,
        inclination: 41.5,
        battery_level: 93,
        signal_strength: 96,
        temperature: 21,
        position_x: 4234.8,
        position_y: 1987.3,
        position_z: 3812.6,
        velocity_x: -5.3,
        velocity_y: 3.9,
        velocity_z: 4.2
      },
      {
        name: "TerraSAR-X",
        type: "Earth Observation",
        country: "Germany",
        status: "operational" as const,
        altitude: 514,
        inclination: 97.44,
        battery_level: 86,
        signal_strength: 90,
        temperature: 17,
        position_x: 4567.2,
        position_y: -1234.9,
        position_z: 4301.8,
        velocity_x: -1.2,
        velocity_y: 5.8,
        velocity_z: 4.1
      },
      {
        name: "ALOS-2",
        type: "Earth Observation",
        country: "Japan",
        status: "operational" as const,
        altitude: 628,
        inclination: 97.92,
        battery_level: 82,
        signal_strength: 88,
        temperature: 19,
        position_x: 4923.7,
        position_y: -1089.4,
        position_z: 4634.2,
        velocity_x: -1.4,
        velocity_y: 6.0,
        velocity_z: 3.9
      },
      {
        name: "MetOp-C",
        type: "Weather",
        country: "ESA",
        status: "maintenance" as const,
        altitude: 817,
        inclination: 98.7,
        battery_level: 67,
        signal_strength: 74,
        temperature: 23,
        position_x: 5489.1,
        position_y: -923.7,
        position_z: 5123.8,
        velocity_x: -1.6,
        velocity_y: 6.2,
        velocity_z: 3.7
      },
      {
        name: "COSMIC-2",
        type: "Weather",
        country: "USA",
        status: "operational" as const,
        altitude: 720,
        inclination: 24.0,
        battery_level: 90,
        signal_strength: 92,
        temperature: 16,
        position_x: 5089.4,
        position_y: 2145.8,
        position_z: 4756.3,
        velocity_x: -2.8,
        velocity_y: 5.1,
        velocity_z: 3.2
      }
    ];

    // Insert satellites
    const allSatellites = [...uaeSatellites, ...internationalSatellites];
    await supabase.from('satellites').upsert(allSatellites, { onConflict: 'name' });

    // Generate comprehensive emergency alerts
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
      },
      {
        title: "Battery Low - Nayif-1",
        description: "Battery level at 72%. Entering power conservation mode.",
        type: "system_anomaly",
        severity: "medium" as const,
        affected_assets: ["Nayif-1"],
        status: "active" as const,
        auto_response: "Non-critical systems powered down. Solar panel reorientation in progress."
      },
      {
        title: "Debris Cloud Detected - LEO Corridor",
        description: "Multiple debris fragments detected in LEO corridor. All satellites at risk.",
        type: "collision_warning",
        severity: "high" as const,
        affected_assets: ["KhalifaSat", "MBZ-SAT", "DubaiSat-1", "ISS", "Sentinel-1A"],
        status: "active" as const,
        auto_response: "Tracking initiated. Collision probability calculations in progress."
      },
      {
        title: "Ground Station Maintenance",
        description: "Dubai ground station offline for scheduled maintenance.",
        type: "system_anomaly",
        severity: "low" as const,
        affected_assets: ["UAE Ground Network"],
        status: "resolved" as const,
        auto_response: "Backup ground stations activated. All communications maintained."
      }
    ];

    await supabase.from('alerts').insert(alerts);

    // Generate collision predictions
    const collisionPredictions = [
      {
        satellite1_id: null, // Will be filled in real scenario
        satellite2_id: null,
        probability: 0.15,
        predicted_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        miss_distance: 1.8,
        threat_level: "high" as const
      },
      {
        satellite1_id: null,
        satellite2_id: null,
        probability: 0.08,
        predicted_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
        miss_distance: 3.2,
        threat_level: "medium" as const
      },
      {
        satellite1_id: null,
        satellite2_id: null,
        probability: 0.25,
        predicted_time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
        miss_distance: 0.9,
        threat_level: "critical" as const
      }
    ];

    await supabase.from('collision_predictions').insert(collisionPredictions);

    // Generate threats
    const threats = [
      {
        type: "collision_risk",
        severity: "critical" as const,
        description: "High-velocity debris on collision course with KhalifaSat",
        probability: 0.25,
        recommendation: "Execute evasive maneuver within 6 hours. Coordinate with ground control.",
        status: "active" as const
      },
      {
        type: "space_weather",
        severity: "high" as const,
        description: "Solar flare activity increasing. Radiation levels rising.",
        probability: 0.85,
        recommendation: "Switch to safe mode. Shield sensitive electronics.",
        status: "active" as const
      },
      {
        type: "system_failure",
        severity: "medium" as const,
        description: "Attitude control system anomaly detected on Nayif-1",
        probability: 0.45,
        recommendation: "Run diagnostics. Prepare backup systems.",
        status: "acknowledged" as const
      },
      {
        type: "orbital_decay",
        severity: "low" as const,
        description: "Gradual altitude loss detected on MetOp-C",
        probability: 0.90,
        recommendation: "Schedule orbital boost maneuver within 30 days.",
        status: "active" as const
      }
    ];

    await supabase.from('threats').insert(threats);

    // Generate debris detections with real image URLs
    const detections = [
      {
        image_name: "leo-sector-alpha-001.jpg",
        image_url: debrisLeoAlpha,
        x1: 120,
        y1: 180,
        x2: 280,
        y2: 320,
        confidence: 0.94,
        debris_type: "rocket_body",
        notes: "Large debris fragment detected in LEO corridor"
      },
      {
        image_name: "leo-sector-alpha-001.jpg",
        image_url: debrisLeoAlpha,
        x1: 450,
        y1: 120,
        x2: 580,
        y2: 240,
        confidence: 0.87,
        debris_type: "defunct_satellite",
        notes: "Inactive satellite component"
      },
      {
        image_name: "leo-sector-alpha-001.jpg",
        image_url: debrisLeoAlpha,
        x1: 850,
        y1: 300,
        x2: 950,
        y2: 400,
        confidence: 0.78,
        debris_type: "debris",
        notes: "Small metallic fragment"
      },
      {
        image_name: "leo-sector-beta-002.jpg",
        image_url: debrisLeoBeta,
        x1: 180,
        y1: 250,
        x2: 380,
        y2: 420,
        confidence: 0.91,
        debris_type: "defunct_satellite",
        notes: "Large defunct satellite detected"
      },
      {
        image_name: "leo-sector-beta-002.jpg",
        image_url: debrisLeoBeta,
        x1: 520,
        y1: 180,
        x2: 680,
        y2: 320,
        confidence: 0.85,
        debris_type: "debris",
        notes: "Medium-sized debris cluster"
      },
      {
        image_name: "leo-sector-beta-002.jpg",
        image_url: debrisLeoBeta,
        x1: 820,
        y1: 420,
        x2: 920,
        y2: 520,
        confidence: 0.72,
        debris_type: "debris",
        notes: "Small debris fragment"
      },
      {
        image_name: "geo-sector-gamma-003.jpg",
        image_url: debrisGeoGamma,
        x1: 220,
        y1: 150,
        x2: 380,
        y2: 280,
        confidence: 0.96,
        debris_type: "rocket_body",
        notes: "Rocket stage debris in GEO"
      },
      {
        image_name: "geo-sector-gamma-003.jpg",
        image_url: debrisGeoGamma,
        x1: 650,
        y1: 320,
        x2: 780,
        y2: 450,
        confidence: 0.89,
        debris_type: "debris",
        notes: "Metal fragment from collision event"
      },
      {
        image_name: "geo-sector-gamma-003.jpg",
        image_url: debrisGeoGamma,
        x1: 980,
        y1: 200,
        x2: 1080,
        y2: 300,
        confidence: 0.81,
        debris_type: "defunct_satellite",
        notes: "Decommissioned satellite component"
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
