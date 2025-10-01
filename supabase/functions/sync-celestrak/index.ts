import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import * as satellite from 'https://esm.sh/satellite.js@5.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CelesTrak returns 3-line TLE format when using FORMAT=tle
// Line 0: Satellite name
// Line 1: TLE Line 1
// Line 2: TLE Line 2

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
      
      // Use TLE format to get actual TLE lines
      const response = await fetch(`https://celestrak.org/NORAD/elements/gp.php?GROUP=${category}&FORMAT=tle`);
      
      if (!response.ok) {
        console.error(`Failed to fetch ${category}:`, response.statusText);
        continue;
      }

      const tleText = await response.text();
      const lines = tleText.trim().split('\n');
      console.log(`Received ${lines.length / 3} satellites from ${category}`);

      // Process TLE data in groups of 3 lines (name, line1, line2)
      for (let i = 0; i < lines.length && i < 150; i += 3) { // Limit to 50 per category (150 lines)
        if (i + 2 >= lines.length) break;
        
        const name = lines[i].trim();
        const line1 = lines[i + 1].trim();
        const line2 = lines[i + 2].trim();
        
        try {
          // Validate TLE data exists and has correct length
          if (!name || !line1 || !line2) {
            console.error(`Skipping satellite - missing TLE data:`, name || 'UNKNOWN');
            continue;
          }

          if (line1.length < 69 || line2.length < 69) {
            console.error(`Invalid TLE format for ${name}`);
            continue;
          }

          const satrec = satellite.twoline2satrec(line1, line2);
          
          if (!satrec || satrec.error) {
            console.error(`TLE parsing error for ${name}:`, satrec?.error);
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
          const upperName = name.toUpperCase();
          
          if (upperName.includes('ISS') || upperName.includes('STATION')) {
            type = 'space station';
          } else if (upperName.includes('GPS') || upperName.includes('GLONASS') || upperName.includes('GALILEO')) {
            type = 'navigation';
          } else if (upperName.includes('STARLINK') || upperName.includes('IRIDIUM') || upperName.includes('INTELSAT')) {
            type = 'communication';
          } else if (upperName.includes('LANDSAT') || upperName.includes('SENTINEL') || upperName.includes('TERRA')) {
            type = 'earth observation';
          }

          // Identify UAE satellites
          if (upperName.includes('KHALIFA') || upperName.includes('NAYIF') || upperName.includes('DUBAI') || upperName.includes('MBZ')) {
            country = 'UAE';
            type = 'earth observation';
          }

          allSatellites.push({
            name: name,
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
          console.error(`Error processing satellite ${name || 'UNKNOWN'}:`, error instanceof Error ? error.message : error);
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
