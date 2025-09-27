import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, AlertTriangle, Shield, Zap, TrendingUp } from 'lucide-react';

interface ThreatAnalysisProps {
  onThreatLevelChange: (level: 'low' | 'medium' | 'high' | 'critical') => void;
}

export const ThreatAnalysis = ({ onThreatLevelChange }: ThreatAnalysisProps) => {
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [threats, setThreats] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [collisionProbability, setCollisionProbability] = useState(0);

  const runThreatAnalysis = async () => {
    setAnalysisStatus('analyzing');
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockThreats = [
        {
          id: 1,
          type: 'Collision Risk',
          severity: 'high',
          probability: 85,
          description: 'Debris object 2023-001A on potential collision course with KhalifaSat',
          timeToEvent: '4.2 hours',
          recommendation: 'Execute avoidance maneuver at next window'
        },
        {
          id: 2,
          type: 'Space Weather',
          severity: 'medium',
          probability: 60,
          description: 'Solar storm activity may affect satellite communications',
          timeToEvent: '12 hours',
          recommendation: 'Monitor solar wind parameters, prepare backup systems'
        },
        {
          id: 3,
          type: 'Cyber Security',
          severity: 'low',
          probability: 25,
          description: 'Unusual telemetry patterns detected on DubaiSat-2',
          timeToEvent: 'Ongoing',
          recommendation: 'Verify command authentication protocols'
        }
      ];

      setThreats(mockThreats);
      setCollisionProbability(Math.random() * 100);
      setAiInsights('AI analysis indicates heightened debris activity in LEO. Recommend increased monitoring of UAE assets and preparation of collision avoidance protocols.');
      setAnalysisStatus('complete');
      
      // Update overall threat level
      const highSeverityThreats = mockThreats.filter(t => t.severity === 'high');
      if (highSeverityThreats.length > 0) {
        onThreatLevelChange('high');
      } else {
        onThreatLevelChange('medium');
      }
    }, 3000);
  };

  useEffect(() => {
    runThreatAnalysis();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-500 bg-green-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'high': return 'text-red-500 bg-red-500/20';
      case 'critical': return 'text-purple-500 bg-purple-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Perplexity AI Threat Analysis</span>
            {analysisStatus === 'analyzing' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisStatus === 'analyzing' && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  AI is analyzing current space environment...
                </p>
                <Progress value={66} />
              </div>
            )}
            
            {analysisStatus === 'complete' && (
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>AI Analysis Complete</AlertTitle>
                  <AlertDescription>{aiInsights}</AlertDescription>
                </Alert>
                
                <Button 
                  onClick={runThreatAnalysis} 
                  variant="outline"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Re-analyze
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="threats">Active Threats</TabsTrigger>
          <TabsTrigger value="collision">Collision Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          {threats.map((threat) => (
            <Card key={threat.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{threat.type}</CardTitle>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{threat.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Probability:</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={threat.probability} className="flex-1" />
                        <span className="text-sm">{threat.probability}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Time to Event:</span>
                      <p className="text-sm text-muted-foreground">{threat.timeToEvent}</p>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Recommended Action</AlertTitle>
                    <AlertDescription>{threat.recommendation}</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="collision" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Collision Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {collisionProbability.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Overall collision risk in next 24 hours
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">KhalifaSat</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DubaiSat-2</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={12} className="w-24" />
                      <span className="text-sm font-medium">12%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nayif-1</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={3} className="w-24" />
                      <span className="text-sm font-medium">3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>AI-Generated Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Immediate Actions Required</AlertTitle>
                  <AlertDescription>
                    Execute collision avoidance maneuver for KhalifaSat within the next 2 hours.
                    Recommended delta-V: 0.5 m/s in the anti-velocity direction.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Preventive Measures</AlertTitle>
                  <AlertDescription>
                    Increase monitoring frequency for all UAE assets during solar storm period.
                    Prepare backup communication protocols for potential service disruption.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertTitle>Long-term Strategy</AlertTitle>
                  <AlertDescription>
                    Consider orbital altitude adjustment for DubaiSat-2 to reduce debris encounter probability.
                    Implement automated collision avoidance system for future threat mitigation.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};