import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Satellite, MapPin, Battery, Signal, Thermometer, Gauge } from 'lucide-react';

interface UAESatellite {
  name: string;
  status: 'operational' | 'maintenance' | 'offline';
  altitude: number;
  inclination: number;
  battery: number;
  temperature: number;
  signalStrength: number;
  dataRate: number;
  lastContact: Date;
  mission: string;
  launchDate: Date;
}

export const UAEDashboard = () => {
  const [satellites, setSatellites] = useState<UAESatellite[]>([]);
  const [selectedSatellite, setSelectedSatellite] = useState<string>('');

  useEffect(() => {
    // Initialize UAE satellite data
    const uaeSatellites: UAESatellite[] = [
      {
        name: 'KhalifaSat',
        status: 'operational',
        altitude: 613,
        inclination: 98.1,
        battery: 87,
        temperature: -12,
        signalStrength: 94,
        dataRate: 320,
        lastContact: new Date(Date.now() - 15000),
        mission: 'Earth Observation',
        launchDate: new Date('2018-10-29')
      },
      {
        name: 'DubaiSat-2',
        status: 'operational',
        altitude: 600,
        inclination: 97.8,
        battery: 92,
        temperature: -8,
        signalStrength: 89,
        dataRate: 150,
        lastContact: new Date(Date.now() - 45000),
        mission: 'Earth Observation',
        launchDate: new Date('2013-11-21')
      },
      {
        name: 'Nayif-1',
        status: 'operational',
        altitude: 400,
        inclination: 51.6,
        battery: 78,
        temperature: 5,
        signalStrength: 76,
        dataRate: 9.6,
        lastContact: new Date(Date.now() - 120000),
        mission: 'Amateur Radio',
        launchDate: new Date('2017-02-15')
      },
      {
        name: 'MBZ-SAT',
        status: 'operational',
        altitude: 570,
        inclination: 97.5,
        battery: 91,
        temperature: -15,
        signalStrength: 98,
        dataRate: 450,
        lastContact: new Date(Date.now() - 8000),
        mission: 'Earth Observation',
        launchDate: new Date('2023-03-25')
      },
      {
        name: 'DMSat-1',
        status: 'operational',
        altitude: 550,
        inclination: 97.4,
        battery: 85,
        temperature: -10,
        signalStrength: 92,
        dataRate: 280,
        lastContact: new Date(Date.now() - 25000),
        mission: 'Hyperspectral Imaging',
        launchDate: new Date('2021-03-22')
      }
    ];

    setSatellites(uaeSatellites);
    setSelectedSatellite(uaeSatellites[0].name);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 text-green-400';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400';
      case 'offline': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getHealthStatus = (satellite: UAESatellite) => {
    const factors = [
      satellite.battery > 80 ? 25 : satellite.battery > 60 ? 15 : 5,
      satellite.signalStrength > 90 ? 25 : satellite.signalStrength > 70 ? 15 : 5,
      satellite.temperature > -20 && satellite.temperature < 20 ? 25 : 15,
      Date.now() - satellite.lastContact.getTime() < 60000 ? 25 : 10
    ];
    return factors.reduce((sum, factor) => sum + factor, 0);
  };

  const selectedSat = satellites.find(sat => sat.name === selectedSatellite);

  return (
    <div className="space-y-6">
      {/* UAE Space Assets Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Satellite className="h-5 w-5 text-primary" />
            <span>UAE Space Assets Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{satellites.length}</div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {satellites.filter(s => s.status === 'operational').length}
              </div>
              <p className="text-sm text-muted-foreground">Operational</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">
                {satellites.filter(s => s.status === 'maintenance').length}
              </div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {Math.round(satellites.reduce((sum, sat) => sum + sat.dataRate, 0))}
              </div>
              <p className="text-sm text-muted-foreground">Total Mbps</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">
                {Math.round(satellites.reduce((sum, sat) => sum + getHealthStatus(sat), 0) / satellites.length)}%
              </div>
              <p className="text-sm text-muted-foreground">Avg Health</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fleet" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="missions">Mission Control</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {satellites.map((satellite) => (
              <Card 
                key={satellite.name}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedSatellite(satellite.name)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{satellite.name}</span>
                    <Badge className={getStatusColor(satellite.status)}>
                      {satellite.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Health:</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={getHealthStatus(satellite)} className="w-16" />
                        <span className="text-sm font-medium">{getHealthStatus(satellite)}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <Battery className="h-3 w-3" />
                        <span>{satellite.battery}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Signal className="h-3 w-3" />
                        <span>{satellite.signalStrength}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Thermometer className="h-3 w-3" />
                        <span>{satellite.temperature}°C</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Gauge className="h-3 w-3" />
                        <span>{satellite.dataRate} Mbps</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Last Contact: {satellite.lastContact.toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {selectedSat && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedSat.name} - Detailed Telemetry</span>
                  <Badge className={getStatusColor(selectedSat.status)}>
                    {selectedSat.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Orbital Parameters</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Altitude:</span>
                        <span className="text-sm font-medium">{selectedSat.altitude} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Inclination:</span>
                        <span className="text-sm font-medium">{selectedSat.inclination}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mission:</span>
                        <span className="text-sm font-medium">{selectedSat.mission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Launch Date:</span>
                        <span className="text-sm font-medium">
                          {selectedSat.launchDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">System Health</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Battery Level</span>
                          <span className="text-sm">{selectedSat.battery}%</span>
                        </div>
                        <Progress value={selectedSat.battery} />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Signal Strength</span>
                          <span className="text-sm">{selectedSat.signalStrength}%</span>
                        </div>
                        <Progress value={selectedSat.signalStrength} />
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Temperature:</span>
                        <span className="text-sm font-medium">{selectedSat.temperature}°C</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Data Rate:</span>
                        <span className="text-sm font-medium">{selectedSat.dataRate} Mbps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Maneuvers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">KhalifaSat Station Keeping</p>
                      <p className="text-sm text-muted-foreground">Delta-V: 0.2 m/s</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">MBZ-SAT Attitude Adjustment</p>
                      <p className="text-sm text-muted-foreground">Duration: 15 min</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Collection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Images Captured Today:</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Downlinked:</span>
                    <span className="text-sm font-medium">2.4 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Coverage Area:</span>
                    <span className="text-sm font-medium">UAE + Region</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mission Efficiency:</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};