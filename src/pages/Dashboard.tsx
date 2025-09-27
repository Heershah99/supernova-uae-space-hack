import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SatelliteVisualization } from '@/components/satellite/SatelliteVisualization';
import { ThreatAnalysis } from '@/components/ai/ThreatAnalysis';
import { EmergencyAlerts } from '@/components/alerts/EmergencyAlerts';
import { UAEDashboard } from '@/components/uae/UAEDashboard';
import { AlertTriangle, Satellite, Shield, Globe } from 'lucide-react';

const Dashboard = () => {
  const [activeSatellites, setActiveSatellites] = useState(0);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setActiveSatellites(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Satellite Tracking & Space Domain Awareness
        </h1>
        <p className="text-muted-foreground">
          Real-time monitoring and threat analysis for UAE space assets
        </p>
      </header>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Satellites</CardTitle>
            <Satellite className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSatellites || 1247}</div>
            <p className="text-xs text-muted-foreground">
              +3% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getThreatColor(threatLevel)}`} />
              <span className="text-2xl font-bold capitalize">{threatLevel}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time assessment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              2 critical, 3 medium
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UAE Assets</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              All operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="visualization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
          <TabsTrigger value="threats">AI Threat Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Emergency Alerts</TabsTrigger>
          <TabsTrigger value="uae">UAE Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Orbital Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <SatelliteVisualization />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <ThreatAnalysis onThreatLevelChange={setThreatLevel} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <EmergencyAlerts alerts={alerts} onAlertsChange={setAlerts} />
        </TabsContent>

        <TabsContent value="uae" className="space-y-6">
          <UAEDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;