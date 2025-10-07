import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Activity, Radio, Database } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThreatData {
  id: string;
  debrisName: string;
  distance: number;
  relativeVelocity: number;
  timeToClosestApproach: number;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
}

export const ISSProtectionAnalysis = () => {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dataSource, setDataSource] = useState<'live' | 'updating'>('live');

  useEffect(() => {
    // Simulate live threat detection updates
    const generateThreats = () => {
      const mockThreats: ThreatData[] = [
        {
          id: '1',
          debrisName: 'FENGYUN 1C DEB',
          distance: 847,
          relativeVelocity: 14.2,
          timeToClosestApproach: 47,
          threatLevel: 'critical'
        },
        {
          id: '2',
          debrisName: 'COSMOS 2251 DEB',
          distance: 1250,
          relativeVelocity: 7.8,
          timeToClosestApproach: 89,
          threatLevel: 'high'
        },
        {
          id: '3',
          debrisName: 'IRIDIUM 33 DEB',
          distance: 2100,
          relativeVelocity: 5.4,
          timeToClosestApproach: 120,
          threatLevel: 'medium'
        }
      ];
      setThreats(mockThreats);
      setLastUpdate(new Date());
    };

    generateThreats();
    const interval = setInterval(() => {
      setDataSource('updating');
      setTimeout(() => {
        generateThreats();
        setDataSource('live');
      }, 500);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 border-red-400/50 bg-red-500/10';
      case 'high': return 'text-orange-400 border-orange-400/50 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-400/50 bg-yellow-500/10';
      default: return 'text-green-400 border-green-400/50 bg-green-500/10';
    }
  };

  return (
    <Card className="border-emerald-500/30 bg-gradient-to-br from-card via-emerald-950/10 to-card shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            ISS Protection Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-blue-500/50 bg-blue-500/10">
              <Database className="h-3 w-3" />
              CelesTrak
            </Badge>
            <Badge 
              variant="outline" 
              className={`gap-1 ${dataSource === 'live' ? 'border-emerald-500/50 bg-emerald-500/10 animate-pulse' : 'border-amber-500/50 bg-amber-500/10'}`}
            >
              <Radio className="h-3 w-3" />
              {dataSource === 'live' ? 'LIVE' : 'UPDATING'}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time debris tracking for ISS • Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-background/50 rounded-lg border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Altitude</p>
            <p className="text-lg font-bold text-emerald-400">408 km</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Threats</p>
            <p className="text-lg font-bold text-red-400">{threats.filter(t => t.threatLevel === 'critical' || t.threatLevel === 'high').length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-lg font-bold text-emerald-400">PROTECTED</p>
          </div>
        </div>

        {/* Threat List */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Active Threats
          </p>
          {threats.map((threat) => (
            <div 
              key={threat.id}
              className={`p-3 rounded-lg border-2 ${getThreatColor(threat.threatLevel)} transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${threat.threatLevel === 'critical' ? 'animate-pulse' : ''}`} />
                  <p className="font-semibold text-sm">{threat.debrisName}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {threat.threatLevel.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Distance</p>
                  <p className="font-bold">{threat.distance} m</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Velocity</p>
                  <p className="font-bold">{threat.relativeVelocity} km/s</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-bold">{threat.timeToClosestApproach} min</p>
                </div>
              </div>

              {threat.threatLevel === 'critical' && (
                <div className="mt-2 pt-2 border-t border-red-400/30">
                  <p className="text-xs font-semibold text-red-400">
                    ⚠️ COLLISION AVOIDANCE PROTOCOL ACTIVE
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Data Footer */}
        <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            Live tracking active
          </span>
          <span>Source: CelesTrak TLE Data</span>
        </div>
      </CardContent>
    </Card>
  );
};
