import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';

// Earth component with atmosphere
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Main Earth body */}
      <Sphere ref={earthRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#1e4d8b"
          metalness={0.3}
          roughness={0.7}
          emissive="#0a2540"
          emissiveIntensity={0.2}
        />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[1.02, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color="#4a90e2"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      {/* Cloud layer */}
      <Sphere args={[1.01, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color="#ffffff"
          transparent
          opacity={0.08}
        />
      </Sphere>
    </group>
  );
}

// Enhanced Satellite component with glow
function SatellitePoint({ position, color = "#ff6b6b", name }: { 
  position: [number, number, number]; 
  color?: string;
  name: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
    if (glowRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.02 + 0.08;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      {/* Main satellite body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3}
        />
      </mesh>
      {/* Point light for satellite */}
      <pointLight color={color} intensity={0.5} distance={0.5} />
    </group>
  );
}

// ISS Tracker component
function ISSTracker() {
  const [issPosition, setIssPosition] = useState<[number, number, number]>([0, 0, 0]);
  
  useEffect(() => {
    const updateISSPosition = () => {
      // Simulate ISS orbital position
      const now = new Date();
      const angle = (now.getTime() / 5000) % (2 * Math.PI);
      const x = 1.2 * Math.cos(angle);
      const y = 0.3 * Math.sin(angle * 2);
      const z = 1.2 * Math.sin(angle);
      setIssPosition([x, y, z]);
    };

    updateISSPosition();
    const interval = setInterval(updateISSPosition, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return <SatellitePoint position={issPosition} color="#00ff00" name="ISS" />;
}

// Multiple satellites simulation
function SatelliteConstellation() {
  const [satellites, setSatellites] = useState<Array<{
    id: number;
    position: [number, number, number];
    name: string;
    type: string;
  }>>([]);

  useEffect(() => {
    // Generate random satellite positions
    const sats = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ] as [number, number, number],
      name: `SAT-${i + 1}`,
      type: Math.random() > 0.7 ? 'UAE' : 'OTHER'
    }));
    setSatellites(sats);
  }, []);

  return (
    <>
      {satellites.map((sat) => (
        <SatellitePoint
          key={sat.id}
          position={sat.position}
          color={sat.type === 'UAE' ? '#ffd700' : '#ff6b6b'}
          name={sat.name}
        />
      ))}
    </>
  );
}

export const SatelliteVisualization = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'map'>('3d');

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-500/20 text-green-400">
            ISS - Active
          </Badge>
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">
            UAE Satellites - 12
          </Badge>
          <Badge variant="outline" className="bg-red-500/20 text-red-400">
            Tracked Objects - 1,247
          </Badge>
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="h-[600px] w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black rounded-lg overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
        <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 10, 30]} />
          
          {/* Enhanced lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
          <hemisphereLight intensity={0.3} groundColor="#000000" />
          
          <Stars 
            radius={300} 
            depth={60} 
            count={5000} 
            factor={4} 
            fade 
            speed={0.5}
          />
          
          <Earth />
          <ISSTracker />
          <SatelliteConstellation />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={20}
            minDistance={2}
            autoRotate={isPlaying}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Satellite Info Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">ISS Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Altitude:</span>
                <span className="text-sm font-medium">408 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <span className="text-sm font-medium">27,600 km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Pass:</span>
                <span className="text-sm font-medium">21:34 UTC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">UAE Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">KhalifaSat:</span>
                <Badge variant="outline" className="text-green-500">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">DubaiSat-2:</span>
                <Badge variant="outline" className="text-green-500">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nayif-1:</span>
                <Badge variant="outline" className="text-green-500">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Collision Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">High Risk:</span>
                <span className="text-sm font-medium text-red-500">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Medium Risk:</span>
                <span className="text-sm font-medium text-yellow-500">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Low Risk:</span>
                <span className="text-sm font-medium text-green-500">45</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};