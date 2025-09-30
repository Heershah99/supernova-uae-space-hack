import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAlerts, type Alert } from '@/hooks/useAlerts';

export const RealEmergencyAlerts = () => {
  const { alerts, loading, acknowledgeAlert, resolveAlert } = useAlerts();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading alerts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Emergency Alert System</span>
            <div className="flex gap-2">
              <Badge variant="outline">
                {activeAlerts.length} Active
              </Badge>
              <Badge variant="secondary">
                {acknowledgedAlerts.length} Acknowledged
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-red-500/10 rounded-lg">
              <p className="text-2xl font-bold text-red-500">
                {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
            <div className="text-center p-4 bg-orange-500/10 rounded-lg">
              <p className="text-2xl font-bold text-orange-500">
                {alerts.filter(a => a.severity === 'high' && a.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">High</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
              <p className="text-2xl font-bold text-yellow-500">
                {alerts.filter(a => a.severity === 'medium' && a.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">
                {alerts.filter(a => a.severity === 'low' && a.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Low</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeAlerts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active alerts</p>
          ) : (
            activeAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <Badge variant={getSeverityColor(alert.severity) as any} className="mt-1">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                {alert.affected_assets && alert.affected_assets.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Affected: {alert.affected_assets.join(', ')}
                  </div>
                )}
                {alert.auto_response && (
                  <div className="text-xs bg-muted p-2 rounded">
                    <strong>Auto-response:</strong> {alert.auto_response}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Acknowledged Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {acknowledgedAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-3 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{alert.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};