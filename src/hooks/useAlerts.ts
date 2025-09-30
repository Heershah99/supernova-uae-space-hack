import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  status: string;
  affected_assets?: string[];
  auto_response?: string;
  created_at?: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      toast.error("Failed to load alerts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('alerts')
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success("Alert acknowledged");
    } catch (error: any) {
      toast.error("Failed to acknowledge alert");
    }
  };

  const resolveAlert = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('alerts')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success("Alert resolved");
    } catch (error: any) {
      toast.error("Failed to resolve alert");
    }
  };

  return { alerts, loading, acknowledgeAlert, resolveAlert, refetch: fetchAlerts };
};