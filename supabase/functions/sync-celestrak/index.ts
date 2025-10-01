import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import * as satellite from 'https://esm.sh/satellite.js@5.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CelesTrakSatellite {
  name: string;
  line1: string;
  line2: string;
}

Deno.serve(async (req) => {
  console.log('Sync-celestrak function invoked');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Initializing Supabase client...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

    // Fetch TLE data from CelesTrak for various categories
    const categories = [
      'stations',      // ISS and space stations
      'active',        // Active satellites
      'analyst',       // Analyst satellites
    ];

    const allSatellites: any[] = [];
    
    for (const category of categories) {
      console.log(`Fetching ${category} satellites from CelesTrak...`);
      
      const response = await fetch(`https://celestrak.org/NORAD/elements/gp.php?GROUP=${category}&FORMAT=json`);
      
      if (!response.ok) {
        console.error(`Failed to fetch ${category}:`, response.statusText);
        continue;
      }

      const data = await response.json();
      console.log(`Received ${data.length} satellites from ${category}`);

      // Process each satellite
      for (const sat of data.slice(0, 50)) { // Limit to 50 per category to avoid overload
        try {
          // Validate TLE data exists
          if (!sat.TLE_LINE1 || !sat.TLE_LINE2 || !sat.OBJECT_NAME) {
            console.error(`Skipping satellite - missing TLE data:`, sat.OBJECT_NAME || 'UNKNOWN');
            continue;
          }

          // Check TLE line format (should be 69 characters)
          if (sat.TLE_LINE1.length < 69 || sat.TLE_LINE2.length < 69) {
            console.error(`Invalid TLE format for ${sat.OBJECT_NAME}`);
            continue;
          }

          const satrec = satellite.twoline2satrec(sat.TLE_LINE1, sat.TLE_LINE2);
          
          if (!satrec || satrec.error) {
            console.error(`TLE parsing error for ${sat.OBJECT_NAME}:`, satrec?.error);
            continue;
          }
          
          // Get current position
          const now = new Date();
          const positionAndVelocity = satellite.propagate(satrec, now);
          
          let position_x = null, position_y = null, position_z = null;
          let velocity_x = null, velocity_y = null, velocity_z = null;
          
          if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
            position_x = positionAndVelocity.position.x;
            position_y = positionAndVelocity.position.y;
            position_z = positionAndVelocity.position.z;
          }
          
          if (positionAndVelocity.velocity && typeof positionAndVelocity.velocity !== 'boolean') {
            velocity_x = positionAndVelocity.velocity.x;
            velocity_y = positionAndVelocity.velocity.y;
            velocity_z = positionAndVelocity.velocity.z;
          }

          // Calculate altitude from semi-major axis (in km)
          const altitude = (satrec.am * 6371) - 6371; // Convert to km above Earth's surface
          
          // Determine satellite type based on name patterns
          let type = 'scientific';
          let country = 'International';
          const name = sat.OBJECT_NAME.toUpperCase();
          
          if (name.includes('ISS') || name.includes('STATION')) {
            type = 'space station';
          } else if (name.includes('GPS') || name.includes('GLONASS') || name.includes('GALILEO')) {
            type = 'navigation';
          } else if (name.includes('STARLINK') || name.includes('IRIDIUM') || name.includes('INTELSAT')) {
            type = 'communication';
          } else if (name.includes('LANDSAT') || name.includes('SENTINEL') || name.includes('TERRA')) {
            type = 'earth observation';
          }

          // Identify UAE satellites
          if (name.includes('KHALIFA') || name.includes('NAYIF') || name.includes('DUBAI') || name.includes('MBZ')) {
            country = 'UAE';
            type = 'earth observation';
          }

          allSatellites.push({
            name: sat.OBJECT_NAME,
            type,
            country,
            status: 'operational',
            altitude: Math.round(altitude),
            inclination: parseFloat((satrec.inclo * (180 / Math.PI)).toFixed(2)), // Convert to degrees
            period: Math.round(satrec.no_kozai > 0 ? (1440 / (satrec.no_kozai * 60)) : 0), // Orbital period in minutes
            battery_level: Math.floor(Math.random() * 20) + 80, // Random 80-100%
            signal_strength: Math.floor(Math.random() * 20) + 80, // Random 80-100%
            temperature: Math.floor(Math.random() * 20) + 10, // Random 10-30°C
            position_x: position_x ? Math.round(position_x) : null,
            position_y: position_y ? Math.round(position_y) : null,
            position_z: position_z ? Math.round(position_z) : null,
            velocity_x: velocity_x ? parseFloat(velocity_x.toFixed(2)) : null,
            velocity_y: velocity_y ? parseFloat(velocity_y.toFixed(2)) : null,
            velocity_z: velocity_z ? parseFloat(velocity_z.toFixed(2)) : null,
            last_contact: now.toISOString(),
          });
        } catch (error) {
          console.error(`Error processing satellite ${sat.OBJECT_NAME || 'UNKNOWN'}:`, error instanceof Error ? error.message : error);
        }
      }
    }

    console.log(`Total satellites processed: ${allSatellites.length}`);

    // Clear existing satellites and insert new ones
    const { error: deleteError } = await supabase
      .from('satellites')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error clearing satellites:', deleteError);
    }

    // Insert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < allSatellites.length; i += batchSize) {
      const batch = allSatellites.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('satellites')
        .insert(batch);

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synced ${allSatellites.length} satellites from CelesTrak`,
        satellites: allSatellites.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in sync-celestrak function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
