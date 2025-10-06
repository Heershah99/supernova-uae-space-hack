import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, RefreshCw, AlertCircle, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { useDebrisDetections } from '@/hooks/useDebrisDetections';
import { DebrisDetectionUpload } from './DebrisDetectionUpload';
import { DebrisImageVisualization } from './DebrisImageVisualization';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const AIDebrisDetection = () => {
  const { detections, loading, refetch } = useDebrisDetections();
  const [selectedDetection, setSelectedDetection] = useState<string | null>(null);
  const [groupedView, setGroupedView] = useState(true);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.7) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return 'default';
    if (confidence >= 0.7) return 'secondary';
    return 'destructive';
  };

  const highConfidenceDetections = detections.filter(d => d.confidence >= 0.8);
  const mediumConfidenceDetections = detections.filter(d => d.confidence >= 0.5 && d.confidence < 0.8);
  const lowConfidenceDetections = detections.filter(d => d.confidence < 0.5);

  // Group detections by image
  const detectionsByImage = detections.reduce((acc, detection) => {
    if (!acc[detection.image_name]) {
      acc[detection.image_name] = [];
    }
    acc[detection.image_name].push(detection);
    return acc;
  }, {} as Record<string, typeof detections>);

  const selectedImage = selectedDetection 
    ? detections.find(d => d.id === selectedDetection)?.image_name 
    : null;
  
  const selectedImageDetections = selectedImage 
    ? detectionsByImage[selectedImage] || []
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Debris Detection System
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time AI-powered space debris identification and tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant={groupedView ? "default" : "outline"} 
            size="sm"
            onClick={() => setGroupedView(!groupedView)}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {groupedView ? 'Grouped' : 'List'} View
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <DebrisDetectionUpload />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{detections.length}</div>
            <p className="text-xs text-muted-foreground">AI-identified objects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{highConfidenceDetections.length}</div>
            <p className="text-xs text-muted-foreground">≥ 80% confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medium Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{mediumConfidenceDetections.length}</div>
            <p className="text-xs text-muted-foreground">50-79% confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowConfidenceDetections.length}</div>
            <p className="text-xs text-muted-foreground">&lt; 50% confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Detection List and Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Detections</CardTitle>
            <CardDescription>AI-identified debris objects sorted by confidence</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading detections...</div>
              ) : detections.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No detections yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload detection data to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detections.map((detection) => (
                    <div
                      key={detection.id}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                        selectedDetection === detection.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedDetection(detection.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", getConfidenceColor(detection.confidence))} />
                          <span className="font-medium">{detection.image_name}</span>
                        </div>
                        <Badge variant={getConfidenceBadge(detection.confidence)}>
                          {(detection.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex gap-4">
                          <span>Box: ({detection.x1.toFixed(0)}, {detection.y1.toFixed(0)}) - ({detection.x2.toFixed(0)}, {detection.y2.toFixed(0)})</span>
                        </div>
                        {detection.debris_type && (
                          <div>Type: <span className="text-foreground">{detection.debris_type}</span></div>
                        )}
                        <div className="text-xs">
                          Detected: {new Date(detection.detection_time).toLocaleString()}
                        </div>
                      </div>

                      {detection.linked_debris_id && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                          <AlertCircle className="h-3 w-3" />
                          Linked to tracked debris
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Visualization Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Detection Visualization</CardTitle>
            <CardDescription>
              {selectedDetection 
                ? `Showing detection from ${detections.find(d => d.id === selectedDetection)?.image_name}`
                : "Select a detection to view details"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
              {selectedDetection ? (
                <div className="text-center p-8">
                  {(() => {
                    const detection = detections.find(d => d.id === selectedDetection);
                    if (!detection) return null;
                    
                    return (
                      <div className="space-y-4">
                        {detection.image_url ? (
                          <div className="relative">
                            <img 
                              src={detection.image_url} 
                              alt={detection.image_name}
                              className="max-w-full max-h-[350px] mx-auto rounded-lg"
                            />
                            <div className="mt-4 text-sm text-muted-foreground">
                              Bounding box coordinates will overlay on the image
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div className="space-y-2">
                              <p className="font-medium">Detection Details</p>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>Image: {detection.image_name}</div>
                                <div>Confidence: {(detection.confidence * 100).toFixed(2)}%</div>
                                <div>Bounding Box:</div>
                                <div className="font-mono text-xs">
                                  x1: {detection.x1}, y1: {detection.y1}<br />
                                  x2: {detection.x2}, y2: {detection.y2}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Select a detection from the list to view visualization
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
