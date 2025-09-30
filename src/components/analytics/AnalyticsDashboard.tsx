import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSatellites } from "@/hooks/useSatellites";
import { useAlerts } from "@/hooks/useAlerts";
import { Activity, Satellite as SatelliteIcon, AlertTriangle, TrendingUp, Globe, Shield, Zap, Radio } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export const AnalyticsDashboard = () => {
  const { satellites } = useSatellites();
  const { alerts } = useAlerts();

  // Calculate analytics
  const uaeSatellites = satellites.filter(s => s.country === "UAE");
  const operationalSats = satellites.filter(s => s.status === "operational");
  const avgBattery = satellites.reduce((acc, s) => acc + (s.battery_level || 0), 0) / satellites.length || 0;
  const avgSignal = satellites.reduce((acc, s) => acc + (s.signal_strength || 0), 0) / satellites.length || 0;

  // Status distribution
  const statusData = [
    { name: "Operational", value: satellites.filter(s => s.status === "operational").length, color: "hsl(142, 76%, 36%)" },
    { name: "Degraded", value: satellites.filter(s => s.status === "degraded").length, color: "hsl(48, 96%, 53%)" },
    { name: "Critical", value: satellites.filter(s => s.status === "critical").length, color: "hsl(0, 84%, 60%)" },
  ].filter(d => d.value > 0);

  // Alert severity distribution
  const alertSeverity = [
    { name: "Low", value: alerts.filter(a => a.severity === "low").length, color: "hsl(142, 76%, 36%)" },
    { name: "Medium", value: alerts.filter(a => a.severity === "medium").length, color: "hsl(48, 96%, 53%)" },
    { name: "High", value: alerts.filter(a => a.severity === "high").length, color: "hsl(25, 95%, 53%)" },
    { name: "Critical", value: alerts.filter(a => a.severity === "critical").length, color: "hsl(0, 84%, 60%)" },
  ].filter(d => d.value > 0);

  // Health metrics by satellite
  const healthData = satellites.slice(0, 6).map(s => ({
    name: s.name.length > 10 ? s.name.substring(0, 10) + "..." : s.name,
    battery: s.battery_level || 0,
    signal: s.signal_strength || 0,
    health: ((s.battery_level || 0) + (s.signal_strength || 0)) / 2,
  }));

  // Altitude distribution with area chart
  const altitudeData = satellites.map(s => ({
    name: s.name.length > 8 ? s.name.substring(0, 8) + "..." : s.name,
    altitude: s.altitude || 0,
  })).sort((a, b) => b.altitude - a.altitude).slice(0, 8);

  // Radar chart for UAE satellites
  const uaeRadarData = uaeSatellites.slice(0, 5).map(s => ({
    satellite: s.name.substring(0, 8),
    battery: s.battery_level || 0,
    signal: s.signal_strength || 0,
    altitude: ((s.altitude || 0) / 10),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-primary/30 hover-scale animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <SatelliteIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              {satellites.length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                {operationalSats.length} operational
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-chart-2/10 via-background to-background border-chart-2/30 hover-scale animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-2/20 to-transparent rounded-full blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UAE Assets</CardTitle>
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Globe className="h-5 w-5 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent">
              {uaeSatellites.length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/30">
                {((uaeSatellites.length / satellites.length) * 100).toFixed(0)}% of fleet
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-chart-3/10 via-background to-background border-chart-3/30 hover-scale animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-3/20 to-transparent rounded-full blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Health</CardTitle>
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Activity className="h-5 w-5 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-chart-3 to-success bg-clip-text text-transparent">
              {((avgBattery + avgSignal) / 2).toFixed(1)}%
            </div>
            <div className="flex gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-chart-3" />
                <span className="text-xs text-muted-foreground">{avgBattery.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Radio className="h-3 w-3 text-chart-3" />
                <span className="text-xs text-muted-foreground">{avgSignal.toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-chart-4/10 via-background to-background border-chart-4/30 hover-scale animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-4/20 to-transparent rounded-full blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <div className="p-2 rounded-lg bg-chart-4/10">
              <AlertTriangle className="h-5 w-5 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-chart-4 to-destructive bg-clip-text text-transparent">
              {alerts.length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                {alerts.filter(a => a.severity === "critical").length} critical
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Enhanced with gradients and animations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satellite Status Distribution */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-space-dark/50 via-background to-background border-accent/30 hover-scale animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              Fleet Status Distribution
            </CardTitle>
            <CardDescription>Real-time operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <defs>
                  <linearGradient id="statusGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 76%, 46%)" />
                    <stop offset="100%" stopColor="hsl(142, 76%, 26%)" />
                  </linearGradient>
                  <linearGradient id="statusGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(48, 96%, 63%)" />
                    <stop offset="100%" stopColor="hsl(48, 96%, 43%)" />
                  </linearGradient>
                </defs>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--background))" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alert Severity with gradient bars */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-space-dark/50 via-background to-background border-accent/30 hover-scale animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-chart-4/20 to-transparent rounded-full blur-3xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
              </div>
              Alert Severity Levels
            </CardTitle>
            <CardDescription>Active threat distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={alertSeverity}>
                <defs>
                  {alertSeverity.map((entry, index) => (
                    <linearGradient key={index} id={`alertGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} animationBegin={200} animationDuration={800}>
                  {alertSeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#alertGradient${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Health Metrics with gradient bars */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-space-dark/50 via-background to-background border-accent/30 hover-scale animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-chart-3/20 to-transparent rounded-full blur-3xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-chart-3/10">
                <Activity className="h-5 w-5 text-chart-3" />
              </div>
              Satellite Health Metrics
            </CardTitle>
            <CardDescription>Battery and signal strength status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={healthData}>
                <defs>
                  <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                />
                <Legend />
                <Bar dataKey="battery" fill="url(#batteryGradient)" radius={[8, 8, 0, 0]} name="Battery %" animationBegin={300} animationDuration={800} />
                <Bar dataKey="signal" fill="url(#signalGradient)" radius={[8, 8, 0, 0]} name="Signal %" animationBegin={400} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Altitude Distribution with Area Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-space-dark/50 via-background to-background border-accent/30 hover-scale animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Orbital Altitude Distribution
            </CardTitle>
            <CardDescription>Fleet altitude comparison (km)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={altitudeData}>
                <defs>
                  <linearGradient id="altitudeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="altitude"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#altitudeGradient)"
                  animationBegin={500}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* UAE Radar Chart */}
        {uaeRadarData.length > 0 && (
          <Card className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-space-dark/50 via-background to-background border-accent/30 hover-scale animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-chart-2/20 to-transparent rounded-full blur-3xl" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Globe className="h-5 w-5 text-chart-2" />
                </div>
                UAE Assets Performance Analysis
              </CardTitle>
              <CardDescription>Comprehensive health overview of UAE satellites</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={uaeRadarData}>
                  <defs>
                    <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <PolarAngleAxis dataKey="satellite" stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                  <Radar name="Battery %" dataKey="battery" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} />
                  <Radar name="Signal %" dataKey="signal" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                  <Radar name="Altitude (x10km)" dataKey="altitude" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};