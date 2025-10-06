import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DebrisDetection {
  id: string;
  image_name: string;
  image_url?: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  detection_time: string;
  debris_type?: string;
  linked_debris_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useDebrisDetections = () => {
  const [detections, setDetections] = useState<DebrisDetection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetections();

    const channel = supabase
      .channel('debris-detections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'debris_detections'
        },
        () => {
          fetchDetections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDetections = async () => {
    try {
      const { data, error } = await supabase
        .from('debris_detections')
        .select('*')
        .order('confidence', { ascending: false });

      if (error) throw error;
      setDetections(data || []);
    } catch (error: any) {
      toast.error("Failed to load debris detections");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addDetection = async (detection: Omit<DebrisDetection, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('debris_detections')
        .insert([detection]);

      if (error) throw error;
      toast.success("Debris detection added successfully");
      fetchDetections();
    } catch (error: any) {
      toast.error("Failed to add debris detection");
      console.error(error);
    }
  };

  return { detections, loading, refetch: fetchDetections, addDetection };
};
