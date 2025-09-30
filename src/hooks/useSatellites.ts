import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Satellite {
  id: string;
  name: string;
  type: string;
  status: string;
  country?: string;
  altitude?: number;
  inclination?: number;
  battery_level?: number;
  signal_strength?: number;
  temperature?: number;
  last_contact?: string;
  position_x?: number;
  position_y?: number;
  position_z?: number;
  velocity_x?: number;
  velocity_y?: number;
  velocity_z?: number;
}

export const useSatellites = () => {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSatellites();

    const channel = supabase
      .channel('satellites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'satellites'
        },
        () => {
          fetchSatellites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSatellites = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('satellites')
        .select('*')
        .order('name');

      if (error) throw error;
      setSatellites(data || []);
    } catch (error: any) {
      toast.error("Failed to load satellites");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { satellites, loading, refetch: fetchSatellites };
};