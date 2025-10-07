import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Clock, Radio, Activity, Satellite, Zap } from 'lucide-react';
import { useAlerts, type Alert } from '@/hooks/useAlerts';

const CountdownTimer = ({ createdAt }: { createdAt?: string }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  useEffect(() => {
    if (!createdAt) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [createdAt]);
  
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  
  return (
    <span className="font-mono text-lg">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

export const RealEmergencyAlerts = () => {
  const { alerts, loading, acknowledgeAlert, resolveAlert } = useAlerts();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');

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
      {/* CRITICAL ALERT BANNER */}
      {criticalAlerts.length > 0 && (
        <div className="relative overflow-hidden rounded-lg border-4 border-destructive bg-destructive/10 backdrop-blur-sm">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-1 bg-destructive animate-pulse" />
          
          <div className="relative z-10 p-6">
            {/* Header with live indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Radio className="h-8 w-8 text-destructive animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-ping" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-destructive tracking-tight">
                    CRITICAL COLLISION WARNING
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    SYSTEM TIME: {currentTime.toISOString().split('.')[0]}Z
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="destructive" className="text-lg px-4 py-2 animate-pulse">
                  <Activity className="h-4 w-4 mr-2" />
                  {criticalAlerts.length} ACTIVE THREAT{criticalAlerts.length > 1 ? 'S' : ''}
                </Badge>
              </div>
            </div>

            <Separator className="my-4 bg-destructive/30" />

            {/* Critical alerts with enhanced details */}
            <div className="space-y-4">
              {criticalAlerts.map((alert, index) => (
                <div 
                  key={alert.id} 
                  className="bg-background/50 border-2 border-destructive rounded-lg p-5 backdrop-blur-sm hover:bg-background/70 transition-all"
                >
                  {/* Alert header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="destructive" className="font-mono">
                          ALERT #{String(index + 1).padStart(3, '0')}
                        </Badge>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-xs text-muted-foreground font-mono">
                          TIME ELAPSED: <CountdownTimer createdAt={alert.created_at} />
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-destructive mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        {alert.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Resolve Now
                      </Button>
                    </div>
                  </div>

                  {/* Technical details */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-3 border border-border">
                    <p className="text-sm leading-relaxed mb-3">{alert.description}</p>
                    
                    {alert.affected_assets && alert.affected_assets.length > 0 && (
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Satellite className="h-4 w-4 text-primary" />
                        <span className="font-semibold">Affected Assets:</span>
                        <span className="font-mono text-primary">
                          {alert.affected_assets.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Automated response protocol */}
                  {alert.auto_response && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-primary mb-1">
                            AUTOMATED RESPONSE PROTOCOL ACTIVATED
                          </p>
                          <p className="text-sm text-foreground">
                            {alert.auto_response}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <span>Mission Control Alert Dashboard</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="font-mono">
                {activeAlerts.length} ACTIVE
              </Badge>
              <Badge variant="secondary" className="font-mono">
                {acknowledgedAlerts.length} ACK
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="relative group">
              <div className="text-center p-5 bg-destructive/20 rounded-lg border-2 border-destructive/50 hover:border-destructive transition-all">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-4xl font-bold text-destructive font-mono">
                  {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
                </p>
                <p className="text-xs font-bold text-destructive/80 tracking-wider mt-1">CRITICAL</p>
              </div>
            </div>
            <div className="text-center p-5 bg-orange-500/10 rounded-lg border border-orange-500/30 hover:border-orange-500/50 transition-all">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-orange-500 font-mono">
                {alerts.filter(a => a.severity === 'high' && a.status === 'active').length}
              </p>
              <p className="text-xs text-orange-400 tracking-wider mt-1">HIGH</p>
            </div>
            <div className="text-center p-5 bg-yellow-500/10 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-yellow-500 font-mono">
                {alerts.filter(a => a.severity === 'medium' && a.status === 'active').length}
              </p>
              <p className="text-xs text-yellow-400 tracking-wider mt-1">MEDIUM</p>
            </div>
            <div className="text-center p-5 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-500 font-mono">
                {alerts.filter(a => a.severity === 'low' && a.status === 'active').length}
              </p>
              <p className="text-xs text-blue-400 tracking-wider mt-1">LOW</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts - Non-Critical */}
      {activeAlerts.filter(a => a.severity !== 'critical').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Monitoring Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts
              .filter(a => a.severity !== 'critical')
              .map((alert) => (
                <div 
                  key={alert.id} 
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-all bg-card"
                >
                  {/* Alert header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-base">{alert.title}</h4>
                          <Badge variant={getSeverityColor(alert.severity) as any} className="font-mono text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        ACK
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>

                  {/* Technical details */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    {alert.created_at && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono">
                          {new Date(alert.created_at).toISOString().split('.')[0]}Z
                        </span>
                      </div>
                    )}
                    {alert.affected_assets && alert.affected_assets.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Satellite className="h-3 w-3 text-primary" />
                        <span className="font-mono text-primary">
                          {alert.affected_assets.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Auto-response */}
                  {alert.auto_response && (
                    <div className="bg-muted/50 border border-border rounded p-3">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-primary mb-1">
                            AUTO-RESPONSE ACTIVE
                          </p>
                          <p className="text-xs text-foreground">
                            {alert.auto_response}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {activeAlerts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-lg font-semibold">All Systems Nominal</p>
              <p className="text-sm text-muted-foreground">No active alerts at this time</p>
            </div>
          </CardContent>
        </Card>
      )}

      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Acknowledged Alerts - Awaiting Resolution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {acknowledgedAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{alert.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.acknowledged_at && (
                          <span className="text-xs text-muted-foreground font-mono">
                            ACK: {new Date(alert.acknowledged_at).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
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