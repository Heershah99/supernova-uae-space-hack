import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting space weather data sync...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the space weather data
    const response = await fetch('https://www-app3.gfz-potsdam.de/kp_index/Kp_ap_Ap_SN_F107_nowcast.txt');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch space weather data: ${response.statusText}`);
    }

    const text = await response.text();
    console.log('Fetched space weather data successfully');

    // Parse the data
    const lines = text.split('\n');
    const dataRecords = [];

    for (const line of lines) {
      // Skip comments and empty lines
      if (line.startsWith('#') || line.trim() === '') {
        continue;
      }

      // Parse the fixed-width format
      const parts = line.trim().split(/\s+/);
      
      if (parts.length < 28) {
        continue; // Skip incomplete lines
      }

      const [
        year, month, day,
        days, days_midday,
        bsr, db,
        kp1, kp2, kp3, kp4, kp5, kp6, kp7, kp8,
        ap1, ap2, ap3, ap4, ap5, ap6, ap7, ap8,
        ap_daily, sn,
        f107_obs, f107_adj,
        data_quality
      ] = parts;

      const record = {
        date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
        days: parseInt(days),
        days_midday: parseFloat(days_midday),
        bartels_solar_rotation: parseInt(bsr),
        day_within_rotation: parseInt(db),
        kp1: parseFloat(kp1) === -1 ? null : parseFloat(kp1),
        kp2: parseFloat(kp2) === -1 ? null : parseFloat(kp2),
        kp3: parseFloat(kp3) === -1 ? null : parseFloat(kp3),
        kp4: parseFloat(kp4) === -1 ? null : parseFloat(kp4),
        kp5: parseFloat(kp5) === -1 ? null : parseFloat(kp5),
        kp6: parseFloat(kp6) === -1 ? null : parseFloat(kp6),
        kp7: parseFloat(kp7) === -1 ? null : parseFloat(kp7),
        kp8: parseFloat(kp8) === -1 ? null : parseFloat(kp8),
        ap1: parseInt(ap1) === -1 ? null : parseInt(ap1),
        ap2: parseInt(ap2) === -1 ? null : parseInt(ap2),
        ap3: parseInt(ap3) === -1 ? null : parseInt(ap3),
        ap4: parseInt(ap4) === -1 ? null : parseInt(ap4),
        ap5: parseInt(ap5) === -1 ? null : parseInt(ap5),
        ap6: parseInt(ap6) === -1 ? null : parseInt(ap6),
        ap7: parseInt(ap7) === -1 ? null : parseInt(ap7),
        ap8: parseInt(ap8) === -1 ? null : parseInt(ap8),
        ap_daily: parseInt(ap_daily) === -1 ? null : parseInt(ap_daily),
        sunspot_number: parseInt(sn) === -1 ? null : parseInt(sn),
        f107_obs: parseFloat(f107_obs) === -1.0 ? null : parseFloat(f107_obs),
        f107_adj: parseFloat(f107_adj) === -1.0 ? null : parseFloat(f107_adj),
        data_quality: parseInt(data_quality)
      };

      dataRecords.push(record);
    }

    console.log(`Parsed ${dataRecords.length} space weather records`);

    // Upsert data in batches
    const batchSize = 100;
    for (let i = 0; i < dataRecords.length; i += batchSize) {
      const batch = dataRecords.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('space_weather')
        .upsert(batch, { 
          onConflict: 'date',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`Error upserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      console.log(`Upserted batch ${i / batchSize + 1} (${batch.length} records)`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        records: dataRecords.length,
        message: 'Space weather data synced successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error syncing space weather data:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
