import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Satellite, 
  RefreshCw, 
  TrendingUp,
  Shield,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { useDebrisTracking } from '@/hooks/useDebrisTracking';
import { useSatellites } from '@/hooks/useSatellites';
import { format } from 'date-fns';

export const DebrisTrackingDashboard = () => {
  const { debris, collisionRisks, loading, analyzing, refetch } = useDebrisTracking();
  const { satellites } = useSatellites();

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getThreatBadgeVariant = (level: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const criticalRisks = collisionRisks.filter(r => r.threat_level === 'critical');
  const highRisks = collisionRisks.filter(r => r.threat_level === 'high');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            HERA System
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-Powered Space Debris Detection & Collision Prevention
          </p>
        </div>
        <Button 
          onClick={refetch}
          disabled={analyzing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tracked Debris</p>
                <p className="text-3xl font-bold text-blue-400">{debris.length}</p>
              </div>
              <Target className="h-10 w-10 text-blue-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Risks</p>
                <p className="text-3xl font-bold text-red-400">{criticalRisks.length}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risks</p>
                <p className="text-3xl font-bold text-orange-400">{highRisks.length}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Protected Assets</p>
                <p className="text-3xl font-bold text-green-400">{satellites.length}</p>
              </div>
              <Shield className="h-10 w-10 text-green-400 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="collision-risks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collision-risks" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Collision Risks
          </TabsTrigger>
          <TabsTrigger value="debris-catalog" className="gap-2">
            <Target className="h-4 w-4" />
            Debris Catalog
          </TabsTrigger>
          <TabsTrigger value="protected-assets" className="gap-2">
            <Satellite className="h-4 w-4" />
            Protected Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collision-risks" className="space-y-4">
          {collisionRisks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No collision risks detected. All systems nominal.
              </CardContent>
            </Card>
          ) : (
            collisionRisks.map((risk) => (
              <Card key={risk.id} className="border-l-4" style={{ borderLeftColor: `var(--${risk.threat_level})` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        risk.threat_level === 'critical' ? 'text-red-500 animate-pulse' : 
                        risk.threat_level === 'high' ? 'text-orange-500' : 
                        risk.threat_level === 'medium' ? 'text-yellow-500' : 'text-green-500'
                      }`} />
                      <div>
                        <CardTitle className="text-lg">
                          {risk.satellite_name} ↔ {risk.debris_name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Closest approach: {format(risk.closest_approach, 'PPpp')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getThreatBadgeVariant(risk.threat_level)}>
                      {risk.threat_level.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Collision Probability</p>
                      <div className="mt-2">
                        <Progress value={risk.probability} className="h-2" />
                        <p className="text-sm font-bold mt-1">{risk.probability.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Miss Distance</p>
                      <p className="text-lg font-bold mt-1">{risk.miss_distance.toFixed(2)} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Relative Velocity</p>
                      <p className="text-lg font-bold mt-1">{risk.relative_velocity.toFixed(2)} km/s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time to Event</p>
                      <p className="text-lg font-bold mt-1">
                        {Math.round((risk.closest_approach.getTime() - Date.now()) / 3600000)}h
                      </p>
                    </div>
                  </div>
                  
                  {risk.threat_level === 'critical' && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-red-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-400">Immediate Action Required</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Recommend orbital maneuver or debris avoidance protocol
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="debris-catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Debris Objects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {debris.map((deb) => (
                  <div key={deb.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{deb.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {deb.type.replace('_', ' ')} • {deb.altitude.toFixed(0)} km altitude • {deb.size.toFixed(2)}m
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{deb.mass?.toFixed(0) || '—'} kg</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protected-assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Protected Satellites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {satellites.map((sat) => (
                  <div key={sat.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Satellite className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="font-medium">{sat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {sat.country} • {sat.type}
                        </p>
                      </div>
                    </div>
                    <Badge variant={sat.status === 'operational' ? 'default' : 'secondary'}>
                      {sat.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
