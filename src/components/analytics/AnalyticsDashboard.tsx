import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSatellites } from "@/hooks/useSatellites";
import { useAlerts } from "@/hooks/useAlerts";
import { Activity, Satellite as SatelliteIcon, AlertTriangle, TrendingUp, Globe, Shield } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    { name: "Operational", value: satellites.filter(s => s.status === "operational").length, color: "hsl(var(--success))" },
    { name: "Degraded", value: satellites.filter(s => s.status === "degraded").length, color: "hsl(var(--warning))" },
    { name: "Critical", value: satellites.filter(s => s.status === "critical").length, color: "hsl(var(--destructive))" },
  ].filter(d => d.value > 0);

  // Alert severity distribution
  const alertSeverity = [
    { name: "Low", value: alerts.filter(a => a.severity === "low").length, color: "hsl(var(--chart-1))" },
    { name: "Medium", value: alerts.filter(a => a.severity === "medium").length, color: "hsl(var(--chart-2))" },
    { name: "High", value: alerts.filter(a => a.severity === "high").length, color: "hsl(var(--chart-3))" },
    { name: "Critical", value: alerts.filter(a => a.severity === "critical").length, color: "hsl(var(--chart-4))" },
  ].filter(d => d.value > 0);

  // Health metrics by satellite
  const healthData = satellites.slice(0, 6).map(s => ({
    name: s.name.length > 10 ? s.name.substring(0, 10) + "..." : s.name,
    battery: s.battery_level || 0,
    signal: s.signal_strength || 0,
    temp: Math.abs((s.temperature || 20) - 20) * 5, // Normalize temperature
  }));

  // Altitude distribution
  const altitudeData = satellites.map(s => ({
    name: s.name.length > 10 ? s.name.substring(0, 10) + "..." : s.name,
    altitude: s.altitude || 0,
  })).sort((a, b) => b.altitude - a.altitude).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-space-dark via-background to-background border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <SatelliteIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{satellites.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success font-semibold">{operationalSats.length}</span> operational
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-space-dark via-background to-background border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UAE Assets</CardTitle>
            <Globe className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{uaeSatellites.length}</div>
            <p className="text-xs text-muted-foreground">
              {((uaeSatellites.length / satellites.length) * 100).toFixed(0)}% of fleet
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-space-dark via-background to-background border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Health</CardTitle>
            <Activity className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{((avgBattery + avgSignal) / 2).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Battery: {avgBattery.toFixed(0)}% | Signal: {avgSignal.toFixed(0)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-space-dark via-background to-background border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive font-semibold">
                {alerts.filter(a => a.severity === "critical").length}
              </span> critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satellite Status Distribution */}
        <Card className="bg-gradient-to-br from-space-dark via-background to-background border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Fleet Status Distribution
            </CardTitle>
            <CardDescription>Current operational status of all satellites</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alert Severity */}
        <Card className="bg-gradient-to-br from-space-dark via-background to-background border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-chart-4" />
              Alert Severity Levels
            </CardTitle>
            <CardDescription>Distribution of active alerts by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertSeverity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
                  {alertSeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Health Metrics */}
        <Card className="bg-gradient-to-br from-space-dark via-background to-background border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-chart-3" />
              Satellite Health Metrics
            </CardTitle>
            <CardDescription>Battery, signal strength, and temperature status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
                <Bar dataKey="battery" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} name="Battery %" />
                <Bar dataKey="signal" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Signal %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Altitude Distribution */}
        <Card className="bg-gradient-to-br from-space-dark via-background to-background border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Orbital Altitude Distribution
            </CardTitle>
            <CardDescription>Altitude comparison across fleet (km)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={altitudeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="altitude" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
