import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Satellite } from "@/hooks/useSatellites";

interface RealThreatAnalysisProps {
  satellites: Satellite[];
  onThreatLevelChange: (level: 'low' | 'medium' | 'high' | 'critical') => void;
}

const RealThreatAnalysis = ({ satellites, onThreatLevelChange }: RealThreatAnalysisProps) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const runAIAnalysis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-threats', {
        body: { satellites }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      
      // Determine threat level from analysis
      const analysisLower = data.analysis.toLowerCase();
      if (analysisLower.includes('critical')) {
        onThreatLevelChange('critical');
      } else if (analysisLower.includes('high')) {
        onThreatLevelChange('high');
      } else if (analysisLower.includes('medium')) {
        onThreatLevelChange('medium');
      } else {
        onThreatLevelChange('low');
      }

      toast.success("AI analysis complete");
    } catch (error: any) {
      toast.error(error.message || "AI analysis failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI-Powered Threat Analysis
        </CardTitle>
        <CardDescription>
          Real-time AI analysis using Gemini 2.5 Flash
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runAIAnalysis} disabled={loading || satellites.length === 0}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Run AI Analysis"
          )}
        </Button>

        {analysis && (
          <div className="space-y-4">
            <Badge variant="outline">Latest Analysis</Badge>
            <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm">
              {analysis}
            </div>
          </div>
        )}

        {!analysis && !loading && (
          <p className="text-sm text-muted-foreground">
            Click "Run AI Analysis" to get real-time threat assessment from our AI model.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealThreatAnalysis;