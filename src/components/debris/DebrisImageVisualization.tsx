import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    canvas.width = 640;
    canvas.height = 480;

    // Draw placeholder background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#2d2d44';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    drawBoundingBoxes(ctx);
    setImageLoaded(true);
  };

  const drawBoundingBoxes = (ctx: CanvasRenderingContext2D) => {
    detections.forEach((detection) => {
      const { x1, y1, x2, y2, confidence, debris_type } = detection;

      // Color based on confidence
      let color = '#22c55e'; // green
      if (confidence < 0.7) color = '#eab308'; // yellow
      if (confidence < 0.5) color = '#f97316'; // orange

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      // Draw label background
      const label = `${debris_type || 'Debris'} ${(confidence * 100).toFixed(0)}%`;
      ctx.font = 'bold 14px Inter, system-ui, sans-serif';
      const textMetrics = ctx.measureText(label);
      const textHeight = 20;
      const padding = 4;

      ctx.fillStyle = color;
      ctx.fillRect(
        x1,
        y1 - textHeight - padding,
        textMetrics.width + padding * 2,
        textHeight + padding
      );

      // Draw label text
      ctx.fillStyle = '#000';
      ctx.fillText(label, x1 + padding, y1 - padding - 4);

      // Draw corner markers
      const markerSize = 15;
      ctx.lineWidth = 4;
      
      // Top-left
      ctx.beginPath();
      ctx.moveTo(x1, y1 + markerSize);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1 + markerSize, y1);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(x2 - markerSize, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y1 + markerSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(x1, y2 - markerSize);
      ctx.lineTo(x1, y2);
      ctx.lineTo(x1 + markerSize, y2);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(x2 - markerSize, y2);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, y2 - markerSize);
      ctx.stroke();
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{imageName}</CardTitle>
          <Badge variant="outline">
            {detections.length} detection{detections.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-card rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-auto border border-border"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          {detections.map((detection, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
              <span>{detection.debris_type || 'Unknown'}</span>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Box: ({detection.x1.toFixed(0)}, {detection.y1.toFixed(0)}) → ({detection.x2.toFixed(0)}, {detection.y2.toFixed(0)})
                </span>
                <Badge variant={detection.confidence >= 0.7 ? 'default' : 'secondary'}>
                  {(detection.confidence * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
