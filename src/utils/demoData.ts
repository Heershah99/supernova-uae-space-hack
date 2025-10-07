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

    // Generate comprehensive emergency alerts with realistic distance data
    const alerts = [
      {
        title: "⚠️ IMMINENT COLLISION - KhalifaSat",
        description: "CRITICAL: Defunct satellite fragment detected 847 meters from KhalifaSat. Collision probability: 78%. Relative velocity: 14.2 km/s. Time to closest approach: 47 minutes. IMMEDIATE EVASIVE ACTION REQUIRED.",
        type: "collision_warning",
        severity: "critical" as const,
        affected_assets: ["KhalifaSat"],
        status: "active" as const,
        auto_response: "🚨 EMERGENCY PROTOCOL ACTIVATED: Automated collision avoidance maneuver initiated. Thrusters firing in T-15 minutes. Ground control alerted. All non-essential systems shutting down to preserve fuel for evasive maneuver."
      },
      {
        title: "🔴 CATASTROPHIC COLLISION RISK - MBZ-SAT",
        description: "EXTREME DANGER: Large debris object (estimated 2.3m diameter) on direct collision course. Current distance: 1,234 meters. Closing velocity: 15.8 km/s. Impact probability: 92%. Time to impact: 23 minutes. THIS IS NOT A DRILL.",
        type: "collision_warning",
        severity: "critical" as const,
        affected_assets: ["MBZ-SAT"],
        status: "active" as const,
        auto_response: "🚨 MAXIMUM ALERT: Emergency maneuver sequence initiated. All backup systems online. Mission control executing emergency collision avoidance protocol CAP-ALPHA-1. Fuel reserves: 87%. Preparing for high-delta-v burn."
      },
      {
        title: "⚠️ HIGH-VELOCITY DEBRIS APPROACH - DubaiSat-1",
        description: "URGENT: Rocket body fragment detected 3.8 km away and closing fast. Relative velocity: 12.4 km/s. Miss distance predicted: 450 meters (BELOW SAFETY THRESHOLD). Collision probability: 45%. Time to closest approach: 2 hours 14 minutes.",
        type: "collision_warning",
        severity: "high" as const,
        affected_assets: ["DubaiSat-1"],
        status: "active" as const,
        auto_response: "Alert Level HIGH: Tracking debris continuously. Orbital path adjustment calculated. Maneuver window: 78 minutes. Ground team on standby. Satellite health: nominal. Ready for evasive action."
      },
      {
        title: "🌟 Severe Solar Storm Incoming",
        description: "G4-class geomagnetic storm detected. Solar flare radiation traveling at 1,800 km/s. Expected arrival: 8 hours 32 minutes. All LEO satellites will experience radiation exposure 15x normal levels. Communication disruptions likely for 12-18 hours.",
        type: "space_weather",
        severity: "high" as const,
        affected_assets: ["All LEO satellites", "KhalifaSat", "MBZ-SAT", "DubaiSat-1", "Nayif-1"],
        status: "active" as const,
        auto_response: "Storm Protocol Engaged: All satellites entering radiation-safe mode. Solar panels angling for minimum exposure. Sensitive electronics entering shielded state. Ground communications switching to backup frequencies."
      },
      {
        title: "⚠️ Debris Cloud Intercept - LEO Corridor",
        description: "WARNING: Multiple debris fragments detected in UAE satellite corridor. 47 objects tracked. Closest object: 5.2 km from KhalifaSat. Debris field density: HIGH. Fragment velocities: 7-16 km/s. All assets in affected zone at elevated risk for next 6 hours.",
        type: "collision_warning",
        severity: "high" as const,
        affected_assets: ["KhalifaSat", "MBZ-SAT", "DubaiSat-1", "ISS", "Sentinel-1A", "Starlink-1234"],
        status: "active" as const,
        auto_response: "Multi-Asset Alert: Continuous tracking of all 47 fragments initiated. Collision probability matrix updating every 30 seconds. All affected satellites on heightened alert. Automated avoidance systems armed and ready."
      },
      {
        title: "🔶 Potential Debris Encounter - Nayif-1",
        description: "ADVISORY: Small debris object (est. 15cm) detected 8.7 km from Nayif-1. Relative velocity: 9.2 km/s. Miss distance: 1.2 km. Collision probability: 8%. Monitoring closely. Object too small for accurate trajectory prediction.",
        type: "collision_warning",
        severity: "medium" as const,
        affected_assets: ["Nayif-1"],
        status: "active" as const,
        auto_response: "Monitoring Mode: Debris tracking radar locked on target. Trajectory calculations updating every 2 minutes. Satellite orientation optimized to minimize cross-section. Ready to execute avoidance if probability exceeds 15%."
      },
      {
        title: "⚠️ ISS Conjunction Warning",
        description: "International Space Station passing within 15 km of UAE satellite corridor. Distance from KhalifaSat: 12.4 km at closest approach. Time to conjunction: 3 hours 45 minutes. Coordination with NASA ongoing. No collision risk but monitoring required.",
        type: "collision_warning",
        severity: "medium" as const,
        affected_assets: ["KhalifaSat", "ISS"],
        status: "acknowledged" as const,
        auto_response: "Coordination Protocol: Direct link established with ISS mission control. Orbital elements exchanged. Safe passage confirmed. All systems monitoring conjunction event."
      },
      {
        title: "Battery Critical - Nayif-1",
        description: "Power systems warning: Battery level at 68% and declining. Solar panel efficiency reduced by 12%. Estimated time to critical level (50%): 4 hours 20 minutes. Non-essential systems being shut down to conserve power.",
        type: "system_anomaly",
        severity: "medium" as const,
        affected_assets: ["Nayif-1"],
        status: "active" as const,
        auto_response: "Power Conservation Active: All non-critical systems offline. Solar panel diagnostic initiated. Battery temperature: nominal. Ground team analyzing power consumption patterns. Backup power protocols ready."
      },
      {
        title: "Signal Anomaly - DubaiSat-1", 
        description: "Telemetry signal strength dropped to 67% (-8dB from nominal). Possible antenna misalignment or atmospheric interference. Data link quality: degraded but stable. No immediate threat to mission operations.",
        type: "system_anomaly",
        severity: "low" as const,
        affected_assets: ["DubaiSat-1"],
        status: "acknowledged" as const,
        auto_response: "Communications Check: Backup ground station now primary. Signal quality improving. Antenna diagnostics scheduled for next contact window. Data buffering enabled."
      },
      {
        title: "Routine Maintenance Complete",
        description: "Al Ain ground station maintenance window completed successfully. All systems tested and operational. Station returned to active status. Communication links re-established with all UAE assets.",
        type: "system_anomaly",
        severity: "low" as const,
        affected_assets: ["UAE Ground Network"],
        status: "resolved" as const,
        auto_response: "Ground Network Status: All stations operational. Redundancy restored to 100%. Communication quality: excellent across all links."
      }
    ];

    await supabase.from('alerts').insert(alerts);

    // Generate realistic collision predictions with detailed distance data
    const collisionPredictions = [
      {
        satellite1_id: null, // Will be filled in real scenario
        satellite2_id: null,
        probability: 0.78,
        predicted_time: new Date(Date.now() + 47 * 60 * 1000).toISOString(), // 47 minutes from now
        miss_distance: 0.847, // 847 meters - CRITICAL
        threat_level: "critical" as const
      },
      {
        satellite1_id: null,
        satellite2_id: null,
        probability: 0.92,
        predicted_time: new Date(Date.now() + 23 * 60 * 1000).toISOString(), // 23 minutes from now
        miss_distance: 1.234, // 1.2 km - CATASTROPHIC
        threat_level: "critical" as const
      },
      {
        satellite1_id: null,
        satellite2_id: null,
        probability: 0.45,
        predicted_time: new Date(Date.now() + 134 * 60 * 1000).toISOString(), // 2 hours 14 minutes
        miss_distance: 0.450, // 450 meters - HIGH RISK
        threat_level: "high" as const
      },
      {
        satellite1_id: null,
        satellite2_id: null,
        probability: 0.08,
        predicted_time: new Date(Date.now() + 225 * 60 * 1000).toISOString(), // 3 hours 45 minutes
        miss_distance: 1.2, // 1.2 km
        threat_level: "medium" as const
      },
      {
        satellite1_id: null,
        satellite2_id: null,
        probability: 0.32,
        predicted_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
        miss_distance: 5.2, // 5.2 km - debris cloud
        threat_level: "high" as const
      }
    ];

    await supabase.from('collision_predictions').insert(collisionPredictions);

    // Generate realistic threats with distance metrics
    const threats = [
      {
        type: "collision_risk",
        severity: "critical" as const,
        description: "IMMINENT COLLISION: Defunct satellite fragment 847m from KhalifaSat. Relative velocity: 14.2 km/s. Impact probability: 78%. Time to collision: 47 minutes.",
        probability: 0.78,
        recommendation: "🚨 EXECUTE IMMEDIATE EVASIVE MANEUVER. Activate emergency thrusters. Delta-V requirement: 2.4 m/s. Coordinate with mission control NOW.",
        status: "active" as const
      },
      {
        type: "collision_risk",
        severity: "critical" as const,
        description: "CATASTROPHIC THREAT: Large debris object (2.3m) on direct collision course with MBZ-SAT. Distance: 1,234m. Closing velocity: 15.8 km/s. Collision probability: 92%. Impact in 23 minutes.",
        probability: 0.92,
        recommendation: "🚨 EMERGENCY PROTOCOL: Execute maximum delta-V burn immediately. All backup systems to online. Prepare for high-G maneuver. Mission critical action required.",
        status: "active" as const
      },
      {
        type: "collision_risk",
        severity: "high" as const,
        description: "HIGH-VELOCITY APPROACH: Rocket body fragment 3.8km from DubaiSat-1. Velocity: 12.4 km/s. Predicted miss distance: 450m (below safety threshold). Probability: 45%.",
        probability: 0.45,
        recommendation: "⚠️ PREPARE EVASIVE ACTION: Calculate optimal maneuver window. Standby for burn execution within 78 minutes. Monitor continuously.",
        status: "active" as const
      },
      {
        type: "space_weather",
        severity: "high" as const,
        description: "G4-class geomagnetic storm detected. Solar radiation traveling at 1,800 km/s. Impact in 8.5 hours. Radiation exposure: 15x nominal levels for 12-18 hours.",
        probability: 0.95,
        recommendation: "⚠️ STORM PROTOCOL: Enter radiation-safe mode. Orient solar panels for minimum exposure. Shield sensitive electronics. Switch to backup communication frequencies.",
        status: "active" as const
      },
      {
        type: "collision_risk",
        severity: "high" as const,
        description: "DEBRIS CLOUD ALERT: 47 fragments detected in UAE satellite corridor. Closest object 5.2km from KhalifaSat. Fragment velocities: 7-16 km/s. Elevated risk for next 6 hours.",
        probability: 0.32,
        recommendation: "⚠️ HEIGHTENED ALERT: Continuous tracking of all fragments. Automated avoidance systems armed. Monitor collision matrix every 30 seconds.",
        status: "active" as const
      },
      {
        type: "collision_risk",
        severity: "medium" as const,
        description: "Small debris object (15cm) detected 8.7km from Nayif-1. Velocity: 9.2 km/s. Miss distance: 1.2km. Probability: 8%. Size limits trajectory accuracy.",
        probability: 0.08,
        recommendation: "Monitor closely. Maintain tracking radar lock. Execute avoidance if probability exceeds 15%. Optimize satellite cross-section.",
        status: "active" as const
      },
      {
        type: "system_failure",
        severity: "medium" as const,
        description: "Power systems critical: Nayif-1 battery at 68% and declining. Solar efficiency down 12%. Time to critical (50%): 4h 20m.",
        probability: 0.75,
        recommendation: "Shutdown all non-essential systems. Run solar panel diagnostics. Monitor battery temperature. Prepare backup power protocols.",
        status: "active" as const
      },
      {
        type: "orbital_decay",
        severity: "low" as const,
        description: "Gradual altitude loss: MetOp-C losing 120m per day. Current altitude: 817km. Decay rate within expected parameters.",
        probability: 0.90,
        recommendation: "Schedule orbital boost maneuver within 30 days. Calculate fuel requirements. No immediate action needed.",
        status: "acknowledged" as const
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
