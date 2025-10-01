import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSatellites } from '@/hooks/useSatellites';
import { toast } from 'sonner';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

export const SatelliteManagement = () => {
  const { satellites, loading, refetch } = useSatellites();
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'communication',
    country: '',
    status: 'operational',
    altitude: '',
    inclination: '',
    battery_level: '100',
    signal_strength: '100',
    temperature: '20',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSatellite = async () => {
    if (!formData.name || !formData.country) {
      toast.error('Name and country are required');
      return;
    }

    try {
      const { error } = await supabase.from('satellites').insert([{
        name: formData.name,
        type: formData.type,
        country: formData.country,
        status: formData.status as any,
        altitude: formData.altitude ? parseFloat(formData.altitude) : null,
        inclination: formData.inclination ? parseFloat(formData.inclination) : null,
        battery_level: parseFloat(formData.battery_level),
        signal_strength: parseFloat(formData.signal_strength),
        temperature: parseFloat(formData.temperature),
      }]);

      if (error) throw error;

      toast.success('Satellite added successfully');
      setFormData({
        name: '',
        type: 'communication',
        country: '',
        status: 'operational',
        altitude: '',
        inclination: '',
        battery_level: '100',
        signal_strength: '100',
        temperature: '20',
      });
      setIsAdding(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add satellite');
    }
  };

  const handleSyncCelesTrak = async () => {
    setIsSyncing(true);
    try {
      toast.loading('Fetching real satellite data from CelesTrak...');
      
      const { data, error } = await supabase.functions.invoke('sync-celestrak');
      
      if (error) throw error;
      
      toast.dismiss();
      toast.success(`Successfully synced ${data.satellites} satellites from CelesTrak!`);
      refetch();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Failed to sync with CelesTrak');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this satellite?')) return;

    try {
      const { error } = await supabase.from('satellites').delete().eq('id', id);
      if (error) throw error;
      toast.success('Satellite deleted');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete satellite');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'decommissioned': return 'bg-gray-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Satellite Fleet Management</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={handleSyncCelesTrak} 
                disabled={isSyncing}
                variant="outline"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync CelesTrak'}
              </Button>
              <Button onClick={() => setIsAdding(!isAdding)}>
                <Plus className="mr-2 h-4 w-4" />
                {isAdding ? 'Cancel' : 'Add Manual'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Satellite Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., KhalifaSat"
                  />
                </div>
                <div>
                  <Label>Country *</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="e.g., UAE"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => handleInputChange('type', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="earth observation">Earth Observation</SelectItem>
                      <SelectItem value="navigation">Navigation</SelectItem>
                      <SelectItem value="scientific">Scientific</SelectItem>
                      <SelectItem value="military">Military</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => handleInputChange('status', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="decommissioned">Decommissioned</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Altitude (km)</Label>
                  <Input
                    type="number"
                    value={formData.altitude}
                    onChange={(e) => handleInputChange('altitude', e.target.value)}
                    placeholder="e.g., 550"
                  />
                </div>
                <div>
                  <Label>Inclination (degrees)</Label>
                  <Input
                    type="number"
                    value={formData.inclination}
                    onChange={(e) => handleInputChange('inclination', e.target.value)}
                    placeholder="e.g., 51.6"
                  />
                </div>
                <div>
                  <Label>Battery Level (%)</Label>
                  <Input
                    type="number"
                    value={formData.battery_level}
                    onChange={(e) => handleInputChange('battery_level', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Signal Strength (%)</Label>
                  <Input
                    type="number"
                    value={formData.signal_strength}
                    onChange={(e) => handleInputChange('signal_strength', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <Button onClick={handleAddSatellite} className="w-full">
                Add Satellite
              </Button>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Altitude</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Signal</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : satellites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No satellites found. Add your first satellite above.
                    </TableCell>
                  </TableRow>
                ) : (
                  satellites.map((sat) => (
                    <TableRow key={sat.id}>
                      <TableCell className="font-medium">{sat.name}</TableCell>
                      <TableCell>{sat.country}</TableCell>
                      <TableCell className="capitalize">{sat.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sat.status)}>
                          {sat.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{sat.altitude ? `${sat.altitude} km` : '-'}</TableCell>
                      <TableCell>{sat.battery_level ? `${sat.battery_level}%` : '-'}</TableCell>
                      <TableCell>{sat.signal_strength ? `${sat.signal_strength}%` : '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sat.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
