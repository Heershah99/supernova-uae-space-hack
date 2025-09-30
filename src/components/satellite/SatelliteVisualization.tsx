import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';

// Nebula background effect
function SpaceEnvironment() {
  const nebulaRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group>
      <Sphere ref={nebulaRef} args={[50, 32, 32]}>
        <meshBasicMaterial
          color="#1a0f2e"
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Stars
        radius={100}
        depth={50}
        count={7000}
        factor={6}
        saturation={0.5}
        fade
        speed={1}
      />
    </group>
  );
}

// Enhanced Earth with city lights and realistic atmosphere
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0012;
    }
  });

  return (
    <group>
      {/* Main Earth with improved texturing */}
      <Sphere ref={earthRef} args={[1, 128, 128]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#0d47a1"
          metalness={0.4}
          roughness={0.6}
          emissive="#001a33"
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Continents overlay */}
      <Sphere args={[1.001, 128, 128]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1b5e20"
          metalness={0.2}
          roughness={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* City lights on dark side */}
      <Sphere args={[1.002, 128, 128]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ffeb3b"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Dynamic cloud layer */}
      <Sphere ref={cloudRef} args={[1.015, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Inner atmosphere glow */}
      <Sphere args={[1.03, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial
          color="#0d47a1"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer atmosphere glow */}
      <Sphere ref={atmosphereRef} args={[1.08, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
}

// Orbital path ring
function OrbitalPath({ radius, color }: { radius: number; color: string }) {
  const points = [];
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ));
  }
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.2 }))} />
  );
}

// Enhanced satellite with solar panels and detailed geometry
function SatellitePoint({ 
  position, 
  color = "#00e5ff", 
  name,
  size = 0.05 
}: { 
  position: [number, number, number]; 
  color?: string;
  name: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
    if (glowRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.3 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      {/* Main satellite body */}
      <group ref={meshRef}>
        {/* Core body */}
        <mesh>
          <boxGeometry args={[size * 1.5, size, size]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Solar panels */}
        <mesh position={[0, 0, size * 1.2]}>
          <boxGeometry args={[size * 3, size * 0.1, size * 0.5]} />
          <meshStandardMaterial
            color="#1e88e5"
            metalness={0.8}
            roughness={0.2}
            emissive="#1565c0"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 0, -size * 1.2]}>
          <boxGeometry args={[size * 3, size * 0.1, size * 0.5]} />
          <meshStandardMaterial
            color="#1e88e5"
            metalness={0.8}
            roughness={0.2}
            emissive="#1565c0"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Antenna */}
        <mesh position={[0, size * 0.8, 0]}>
          <cylinderGeometry args={[size * 0.1, size * 0.1, size * 1.2]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
        </mesh>
      </group>
      
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Point light */}
      <pointLight color={color} intensity={1.5} distance={1} decay={2} />
    </group>
  );
}

// ISS with realistic orbit
function ISSTracker() {
  const [issPosition, setIssPosition] = useState<[number, number, number]>([0, 0, 0]);
  
  useEffect(() => {
    const updateISSPosition = () => {
      const now = new Date();
      const angle = (now.getTime() / 4000) % (2 * Math.PI);
      const radius = 1.15;
      const inclination = 0.9;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle) * Math.sin(inclination);
      const z = radius * Math.sin(angle) * Math.cos(inclination);
      setIssPosition([x, y, z]);
    };

    updateISSPosition();
    const interval = setInterval(updateISSPosition, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <OrbitalPath radius={1.15} color="#00ff00" />
      <SatellitePoint position={issPosition} color="#00ff00" name="ISS" size={0.08} />
    </>
  );
}

// Constellation with varied orbits
function SatelliteConstellation() {
  const [satellites, setSatellites] = useState<Array<{
    id: number;
    angle: number;
    radius: number;
    speed: number;
    inclination: number;
    type: string;
    color: string;
  }>>([]);

  useEffect(() => {
    const sats = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      angle: (i / 30) * Math.PI * 2,
      radius: 1.3 + Math.random() * 1.5,
      speed: 0.0005 + Math.random() * 0.001,
      inclination: (Math.random() - 0.5) * Math.PI * 0.5,
      type: Math.random() > 0.75 ? 'UAE' : 'OTHER',
      color: Math.random() > 0.75 ? '#ffd700' : '#00e5ff'
    }));
    setSatellites(sats);
  }, []);

  return (
    <>
      {satellites.map((sat) => {
        const AnimatedSatellite = () => {
          const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
          
          useFrame(() => {
            sat.angle += sat.speed;
            const x = sat.radius * Math.cos(sat.angle);
            const y = sat.radius * Math.sin(sat.angle) * Math.sin(sat.inclination);
            const z = sat.radius * Math.sin(sat.angle) * Math.cos(sat.inclination);
            setPosition([x, y, z]);
          });
          
          return (
            <SatellitePoint
              position={position}
              color={sat.color}
              name={`SAT-${sat.id}`}
            />
          );
        };
        
        return <AnimatedSatellite key={sat.id} />;
      })}
      
      {/* Orbital paths for constellations */}
      <OrbitalPath radius={1.5} color="#00e5ff" />
      <OrbitalPath radius={2.0} color="#ffd700" />
      <OrbitalPath radius={2.5} color="#00e5ff" />
    </>
  );
}

export const SatelliteVisualization = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="shadow-lg shadow-primary/20"
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="shadow-lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            🛰️ ISS - Active
          </Badge>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-lg shadow-amber-500/10">
            🇦🇪 UAE Satellites - 12
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-lg shadow-blue-500/10">
            📡 Tracked - 1,247
          </Badge>
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="h-[700px] w-full rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20 bg-gradient-to-b from-space-dark via-[#0a0a1a] to-black">
        <Canvas camera={{ position: [4, 3, 4], fov: 65 }}>
          <color attach="background" args={['#000000']} />
          
          {/* Dramatic lighting setup */}
          <ambientLight intensity={0.15} />
          <pointLight position={[5, 3, 5]} intensity={2} color="#ffffff" castShadow />
          <pointLight position={[-5, -2, -5]} intensity={0.8} color="#4a90e2" />
          <spotLight
            position={[0, 5, 0]}
            intensity={1}
            angle={0.6}
            penumbra={0.5}
            color="#64b5f6"
          />
          <hemisphereLight intensity={0.2} groundColor="#0a0a2e" color="#1e3a8a" />
          
          <SpaceEnvironment />
          <Earth />
          <ISSTracker />
          <SatelliteConstellation />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={15}
            minDistance={2}
            autoRotate={isPlaying}
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card via-card to-emerald-950/20 border-emerald-500/30 shadow-xl shadow-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              🛰️ ISS Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Altitude:</span>
                <span className="text-sm font-bold text-emerald-400">408 km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <span className="text-sm font-bold text-emerald-400">27,600 km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next Pass:</span>
                <span className="text-sm font-bold text-emerald-400">21:34 UTC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card via-card to-amber-950/20 border-amber-500/30 shadow-xl shadow-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              🇦🇪 UAE Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">KhalifaSat:</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">DubaiSat-2:</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Nayif-1:</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card via-card to-red-950/20 border-red-500/30 shadow-xl shadow-red-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              ⚠️ Collision Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">High Risk:</span>
                <span className="text-sm font-bold text-red-400">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Medium Risk:</span>
                <span className="text-sm font-bold text-amber-400">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Low Risk:</span>
                <span className="text-sm font-bold text-emerald-400">45</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};