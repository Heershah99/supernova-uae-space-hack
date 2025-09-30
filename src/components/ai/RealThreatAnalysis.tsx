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
    <div className="space-y-6">
      {/* AI Analysis Control Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                AI Threat Analysis Engine
              </CardTitle>
              <CardDescription className="mt-2">
                Powered by Google Gemini 2.5 Flash • Real-time satellite data processing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={runAIAnalysis} 
              disabled={loading || satellites.length === 0}
              size="lg"
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing {satellites.length} Satellites...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run AI Analysis
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              AI Model Online
            </div>
          </div>

          {!analysis && !loading && (
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                💡 The AI will analyze {satellites.length} satellites and provide:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Collision risk assessment</li>
                <li>• Orbital anomaly detection</li>
                <li>• Threat level classification</li>
                <li>• Recommended actions</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results Card */}
      {analysis && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Analysis Results</CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Latest • Just Now
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {analysis}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealThreatAnalysis;