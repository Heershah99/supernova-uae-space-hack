import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Clock, Bell, Zap, ShieldAlert } from 'lucide-react';

interface AlertData {
  id: string;
  type: 'collision' | 'debris' | 'weather' | 'cyber' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  affectedAssets: string[];
  autoResponse?: string;
}

interface EmergencyAlertsProps {
  alerts: AlertData[];
  onAlertsChange: (alerts: AlertData[]) => void;
}

export const EmergencyAlerts = ({ alerts, onAlertsChange }: EmergencyAlertsProps) => {
  const [alertHistory, setAlertHistory] = useState<AlertData[]>([]);
  const [autoProtocolsEnabled, setAutoProtocolsEnabled] = useState(true);

  useEffect(() => {
    // Simulate incoming alerts
    const generateAlert = () => {
      const alertTypes = ['collision', 'debris', 'weather', 'cyber', 'system'] as const;
      const severities = ['low', 'medium', 'high', 'critical'] as const;
      const assets = ['KhalifaSat', 'DubaiSat-2', 'Nayif-1', 'ISS'];

      const newAlert: AlertData = {
        id: `alert-${Date.now()}`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        title: `${alertTypes[Math.floor(Math.random() * alertTypes.length)].toUpperCase()} Alert`,
        description: 'Automated threat detection system has identified a potential risk.',
        timestamp: new Date(),
        status: 'active',
        affectedAssets: [assets[Math.floor(Math.random() * assets.length)]],
        autoResponse: autoProtocolsEnabled ? 'Automated response protocol initiated' : undefined
      };

      onAlertsChange([...alerts, newAlert]);
    };

    // Generate initial alerts
    if (alerts.length === 0) {
      const initialAlerts: AlertData[] = [
        {
          id: 'alert-1',
          type: 'collision',
          severity: 'critical',
          title: 'COLLISION ALERT - IMMEDIATE ACTION REQUIRED',
          description: 'Debris object 2023-001A on collision course with KhalifaSat. Time to closest approach: 4.2 hours.',
          timestamp: new Date(Date.now() - 30000),
          status: 'active',
          affectedAssets: ['KhalifaSat'],
          autoResponse: 'Collision avoidance maneuver calculated and ready for execution'
        },
        {
          id: 'alert-2',
          type: 'weather',
          severity: 'medium',
          title: 'Solar Storm Warning',
          description: 'Moderate solar storm activity detected. Potential communication disruption expected.',
          timestamp: new Date(Date.now() - 120000),
          status: 'acknowledged',
          affectedAssets: ['DubaiSat-2', 'Nayif-1'],
          autoResponse: 'Backup communication protocols activated'
        }
      ];
      onAlertsChange(initialAlerts);
    }

    const interval = setInterval(generateAlert, 30000);
    return () => clearInterval(interval);
  }, [alerts, onAlertsChange, autoProtocolsEnabled]);

  const acknowledgeAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' as const } : alert
    );
    onAlertsChange(updatedAlerts);
  };

  const resolveAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
    );
    onAlertsChange(updatedAlerts);
    
    // Move to history
    const resolvedAlert = alerts.find(a => a.id === alertId);
    if (resolvedAlert) {
      setAlertHistory(prev => [...prev, { ...resolvedAlert, status: 'resolved' }]);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Bell className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged');

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Emergency Response Center</span>
            </span>
            <Button
              variant={autoProtocolsEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoProtocolsEnabled(!autoProtocolsEnabled)}
            >
              {autoProtocolsEnabled ? 'Auto Protocols: ON' : 'Auto Protocols: OFF'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{activeAlerts.length}</div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{acknowledgedAlerts.length}</div>
              <p className="text-sm text-muted-foreground">Acknowledged</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{alertHistory.length}</div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {autoProtocolsEnabled ? '100%' : '0%'}
              </div>
              <p className="text-sm text-muted-foreground">Auto Response</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
        {activeAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No active alerts</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          activeAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getSeverityIcon(alert.severity)}
                    <span>{alert.title}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {alert.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Affected Assets:</span>
                      <p className="text-muted-foreground">
                        {alert.affectedAssets.join(', ')}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Timestamp:</span>
                      <p className="text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {alert.autoResponse && (
                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertTitle>Automated Response</AlertTitle>
                      <AlertDescription>{alert.autoResponse}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <h3 className="text-lg font-semibold text-foreground">Acknowledged Alerts</h3>
          {acknowledgedAlerts.map((alert) => (
            <Card key={alert.id} className="opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    {getSeverityIcon(alert.severity)}
                    <span>{alert.title}</span>
                  </span>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};