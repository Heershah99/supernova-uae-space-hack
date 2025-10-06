import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crosshair, Maximize2, ZoomIn } from 'lucide-react';

interface Detection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  debris_type?: string;
}

interface DebrisImageVisualizationProps {
  imageName: string;
  imageUrl?: string;
  detections: Detection[];
}

export const DebrisImageVisualization = ({
  imageName,
  imageUrl,
  detections
}: DebrisImageVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imageUrl) {
      // Load and draw image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        drawBoundingBoxes(ctx);
        setImageLoaded(true);
      };
      img.onerror = () => {
        drawPlaceholderWithBoxes(ctx);
      };
      img.src = imageUrl;
    } else {
      drawPlaceholderWithBoxes(ctx);
    }
  }, [imageUrl, detections]);

  const drawPlaceholderWithBoxes = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    canvas.width = 800;
    canvas.height = 600;

    // Draw deep space background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw precision grid
    ctx.strokeStyle = '#00ff4410';
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let i = 0; i < canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
      
      // Grid labels
      if (i % (gridSize * 2) === 0) {
        ctx.fillStyle = '#00ff4440';
        ctx.font = '10px monospace';
        ctx.fillText(i.toString(), i + 2, 12);
      }
    }
    
    for (let i = 0; i < canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
      
      if (i % (gridSize * 2) === 0) {
        ctx.fillStyle = '#00ff4440';
        ctx.font = '10px monospace';
        ctx.fillText(i.toString(), 2, i - 2);
      }
    }

    // Draw crosshairs at center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.strokeStyle = '#00ff4460';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(centerX - 30, centerY);
    ctx.lineTo(centerX + 30, centerY);
    ctx.moveTo(centerX, centerY - 30);
    ctx.lineTo(centerX, centerY + 30);
    ctx.stroke();

    // Draw corner frame markers
    ctx.strokeStyle = '#00ff44';
    ctx.lineWidth = 3;
    const cornerSize = 30;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(0, cornerSize);
    ctx.lineTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(canvas.width - cornerSize, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, cornerSize);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - cornerSize);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(cornerSize, canvas.height);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(canvas.width - cornerSize, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, canvas.height - cornerSize);
    ctx.stroke();

    // Add technical overlay text
    ctx.fillStyle = '#00ff44';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('DEBRIS DETECTION SYSTEM v3.2', 10, canvas.height - 10);
    ctx.fillText('SCANNING...', canvas.width - 120, 20);

    drawBoundingBoxes(ctx);
    setImageLoaded(true);
  };

  const drawBoundingBoxes = (ctx: CanvasRenderingContext2D) => {
    detections.forEach((detection, index) => {
      const { x1, y1, x2, y2, confidence, debris_type } = detection;
      const width = x2 - x1;
      const height = y2 - y1;

      // Determine threat level color
      let color = '#00ff44'; // High confidence - green
      let glowColor = 'rgba(0, 255, 68, 0.3)';
      let threatLevel = 'CONFIRMED';
      
      if (confidence < 0.7) {
        color = '#ffff00'; // Medium - yellow
        glowColor = 'rgba(255, 255, 0, 0.3)';
        threatLevel = 'PROBABLE';
      }
      if (confidence < 0.5) {
        color = '#ff6600'; // Low - orange
        glowColor = 'rgba(255, 102, 0, 0.3)';
        threatLevel = 'POSSIBLE';
      }

      // Draw glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;

      // Draw main bounding box with double lines
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, width, height);
      
      ctx.lineWidth = 1;
      ctx.strokeRect(x1 + 2, y1 + 2, width - 4, height - 4);

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw targeting corners with enhanced style
      const markerSize = 20;
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      
      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(x1, y1 + markerSize);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1 + markerSize, y1);
      ctx.stroke();
      
      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(x2 - markerSize, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y1 + markerSize);
      ctx.stroke();
      
      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(x1, y2 - markerSize);
      ctx.lineTo(x1, y2);
      ctx.lineTo(x1 + markerSize, y2);
      ctx.stroke();
      
      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(x2 - markerSize, y2);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, y2 - markerSize);
      ctx.stroke();

      // Draw center crosshair
      const centerX = x1 + width / 2;
      const centerY = y1 + height / 2;
      const crossSize = 8;
      
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - crossSize, centerY);
      ctx.lineTo(centerX + crossSize, centerY);
      ctx.moveTo(centerX, centerY - crossSize);
      ctx.lineTo(centerX, centerY + crossSize);
      ctx.stroke();

      // Draw info panel background (semi-transparent)
      const panelHeight = 70;
      const panelWidth = 220;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(x1, y1 - panelHeight - 5, panelWidth, panelHeight);
      
      // Draw panel border
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1 - panelHeight - 5, panelWidth, panelHeight);

      // Draw text info
      ctx.fillStyle = color;
      ctx.font = 'bold 12px monospace';
      
      // ID
      ctx.fillText(`TARGET ID: DBR-${String(index + 1).padStart(4, '0')}`, x1 + 8, y1 - panelHeight + 10);
      
      // Type
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(`TYPE: ${(debris_type || 'UNKNOWN').toUpperCase()}`, x1 + 8, y1 - panelHeight + 28);
      
      // Confidence
      ctx.fillStyle = color;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`CONF: ${(confidence * 100).toFixed(1)}% [${threatLevel}]`, x1 + 8, y1 - panelHeight + 44);
      
      // Dimensions
      ctx.fillStyle = '#888888';
      ctx.font = '10px monospace';
      ctx.fillText(`DIM: ${width.toFixed(0)}×${height.toFixed(0)}px`, x1 + 8, y1 - panelHeight + 60);

      // Draw scan line animation effect
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const scanY = y1 + ((Date.now() / 20) % height);
      ctx.moveTo(x1, scanY);
      ctx.lineTo(x2, scanY);
      ctx.stroke();
    });
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card to-emerald-950/10 border-emerald-500/30">
      <CardHeader className="border-b border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crosshair className="h-5 w-5 text-emerald-400" />
            <CardTitle className="text-lg font-mono text-emerald-400">
              {imageName}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
              {detections.length} TARGET{detections.length !== 1 ? 'S' : ''} LOCKED
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">
              <ZoomIn className="h-3 w-3 mr-1" />
              ENHANCED
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Main visualization area */}
        <div className="relative bg-black border-y border-emerald-500/20">
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ maxHeight: '600px', objectFit: 'contain', imageRendering: 'crisp-edges' }}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                <div className="animate-pulse text-emerald-400 font-mono mb-2">INITIALIZING SCAN...</div>
                <div className="flex gap-1 justify-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Technical overlay */}
          <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
              <div className="flex gap-4">
                <span>◉ LIVE FEED</span>
                <span>RESOLUTION: 800×600</span>
              </div>
              <div className="flex gap-2">
                <span className="animate-pulse">● REC</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detection data table */}
        <div className="p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <Maximize2 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-mono text-emerald-400 font-bold">DETECTION ANALYSIS</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {detections.map((detection, idx) => {
              const width = detection.x2 - detection.x1;
              const height = detection.y2 - detection.y1;
              const area = width * height;
              
              return (
                <div 
                  key={idx} 
                  className="grid grid-cols-6 gap-2 p-3 bg-black/40 border border-emerald-500/20 rounded font-mono text-xs hover:border-emerald-500/40 transition-colors"
                >
                  <div className="col-span-1">
                    <div className="text-emerald-400 font-bold">DBR-{String(idx + 1).padStart(4, '0')}</div>
                    <div className="text-gray-500 text-[10px]">TARGET ID</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-white">{(detection.debris_type || 'UNKNOWN').toUpperCase()}</div>
                    <div className="text-gray-500 text-[10px]">TYPE</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-white">({detection.x1.toFixed(0)}, {detection.y1.toFixed(0)})</div>
                    <div className="text-gray-500 text-[10px]">COORDS</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-white">{width.toFixed(0)}×{height.toFixed(0)}</div>
                    <div className="text-gray-500 text-[10px]">SIZE (px)</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-white">{area.toFixed(0)}</div>
                    <div className="text-gray-500 text-[10px]">AREA (px²)</div>
                  </div>
                  <div className="col-span-1 text-right">
                    <Badge 
                      className={
                        detection.confidence >= 0.7 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : detection.confidence >= 0.5
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      }
                    >
                      {(detection.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
