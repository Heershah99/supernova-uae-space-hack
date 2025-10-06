import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SatelliteVisualization } from '@/components/satellite/SatelliteVisualization';
import RealThreatAnalysis from '@/components/ai/RealThreatAnalysis';
import { RealEmergencyAlerts } from '@/components/alerts/RealEmergencyAlerts';
import { UAEDashboard } from '@/components/uae/UAEDashboard';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { SatelliteManagement } from '@/components/satellite/SatelliteManagement';
import { DebrisTrackingDashboard } from '@/components/debris/DebrisTrackingDashboard';
import { AIDebrisDetection } from '@/components/debris/AIDebrisDetection';
import { AlertTriangle, Satellite, Shield, Globe, LogOut } from 'lucide-react';
import { useSatellites } from '@/hooks/useSatellites';
import { useAlerts } from '@/hooks/useAlerts';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateDemoData } from '@/utils/demoData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { satellites, loading: satellitesLoading } = useSatellites();
  const { alerts, acknowledgeAlert, resolveAlert } = useAlerts();
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const uaeSatellites = satellites.filter(s => s.country === 'UAE');
  const activeAlerts = alerts.filter(a => a.status === 'active');

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
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Space Domain Awareness
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring and AI-powered threat analysis
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Satellites</CardTitle>
            <Satellite className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{satellitesLoading ? '...' : satellites.length}</div>
            <p className="text-xs text-muted-foreground">
              {uaeSatellites.length} UAE assets
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
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {alerts.filter(a => a.severity === 'critical').length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UAE Assets</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uaeSatellites.length}</div>
            <p className="text-xs text-muted-foreground">
              {uaeSatellites.filter(s => s.status === 'operational').length} operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="hera" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="hera">HERA System</TabsTrigger>
          <TabsTrigger value="ai-detection">AI Detection</TabsTrigger>
          <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
          <TabsTrigger value="threats">AI Threat Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Emergency Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="uae">UAE Dashboard</TabsTrigger>
          <TabsTrigger value="management">Manage Satellites</TabsTrigger>
        </TabsList>

        <TabsContent value="hera" className="space-y-6">
          <DebrisTrackingDashboard />
        </TabsContent>

        <TabsContent value="ai-detection" className="space-y-6">
          <AIDebrisDetection />
        </TabsContent>

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
          <RealThreatAnalysis satellites={satellites} onThreatLevelChange={setThreatLevel} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <RealEmergencyAlerts />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="uae" className="space-y-6">
          <UAEDashboard />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <SatelliteManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;