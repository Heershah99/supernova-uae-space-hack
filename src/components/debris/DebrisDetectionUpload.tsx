import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image as ImageIcon, Loader2, Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface CSVRow {
  image_name: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  debris_type?: string;
}

export const DebrisDetectionUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [singleImage, setSingleImage] = useState<File | null>(null);
  const [manualDetection, setManualDetection] = useState({
    x1: '',
    y1: '',
    x2: '',
    y2: '',
    confidence: '',
    debris_type: ''
  });

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        if (['x1', 'y1', 'x2', 'y2', 'confidence'].includes(header)) {
          row[header] = parseFloat(value);
        } else {
          row[header] = value;
        }
      });
      
      return row as CSVRow;
    });
  };

  const handleUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setUploading(true);

    try {
      // Read CSV file
      const csvText = await csvFile.text();
      const detections = parseCSV(csvText);

      // Process each detection
      for (const detection of detections) {
        let imageUrl = null;

        // Upload image if provided
        if (imageFiles) {
          const imageFile = Array.from(imageFiles).find(
            f => f.name === detection.image_name
          );

          if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `debris-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('debris-images')
              .upload(filePath, imageFile);

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from('debris-images')
                .getPublicUrl(filePath);
              
              imageUrl = urlData.publicUrl;
            }
          }
        }

        // Insert detection into database
        const { error } = await supabase
          .from('debris_detections')
          .insert({
            image_name: detection.image_name,
            image_url: imageUrl,
            x1: detection.x1,
            y1: detection.y1,
            x2: detection.x2,
            y2: detection.y2,
            confidence: detection.confidence,
            debris_type: detection.debris_type || 'Unknown',
            detection_time: new Date().toISOString(),
          });

        if (error) throw error;
      }

      toast.success(`Successfully uploaded ${detections.length} detections`);
      setCsvFile(null);
      setImageFiles(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const generateSampleData = async () => {
    setUploading(true);
    try {
      const sampleDetections = [
        { image_name: 'debris_001.jpg', x1: 120, y1: 80, x2: 280, y2: 240, confidence: 0.95, debris_type: 'Satellite Fragment' },
        { image_name: 'debris_002.jpg', x1: 200, y1: 150, x2: 350, y2: 300, confidence: 0.87, debris_type: 'Rocket Body' },
        { image_name: 'debris_003.jpg', x1: 50, y1: 50, x2: 180, y2: 180, confidence: 0.92, debris_type: 'Solar Panel' },
        { image_name: 'debris_004.jpg', x1: 300, y1: 200, x2: 450, y2: 350, confidence: 0.78, debris_type: 'Unknown' },
        { image_name: 'debris_005.jpg', x1: 100, y1: 100, x2: 220, y2: 220, confidence: 0.85, debris_type: 'Antenna Fragment' },
        { image_name: 'debris_006.jpg', x1: 180, y1: 120, x2: 320, y2: 260, confidence: 0.91, debris_type: 'Fuel Tank' },
        { image_name: 'debris_007.jpg', x1: 250, y1: 180, x2: 380, y2: 310, confidence: 0.74, debris_type: 'Satellite Fragment' },
        { image_name: 'debris_008.jpg', x1: 90, y1: 70, x2: 210, y2: 190, confidence: 0.88, debris_type: 'Unknown' },
        { image_name: 'debris_009.jpg', x1: 140, y1: 110, x2: 290, y2: 260, confidence: 0.96, debris_type: 'Rocket Stage' },
        { image_name: 'debris_010.jpg', x1: 200, y1: 160, x2: 340, y2: 300, confidence: 0.82, debris_type: 'Solar Panel' },
      ];

      const { error } = await supabase
        .from('debris_detections')
        .insert(
          sampleDetections.map(d => ({
            ...d,
            detection_time: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          }))
        );

      if (error) throw error;

      toast.success('Sample data generated successfully!');
    } catch (error: any) {
      console.error('Sample data error:', error);
      toast.error(`Failed to generate sample data: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleManualUpload = async () => {
    if (!singleImage) {
      toast.error("Please select an image");
      return;
    }

    const { x1, y1, x2, y2, confidence, debris_type } = manualDetection;
    
    if (!x1 || !y1 || !x2 || !y2 || !confidence) {
      toast.error("Please fill all required fields");
      return;
    }

    setUploading(true);

    try {
      // Upload image
      const fileExt = singleImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('debris-images')
        .upload(filePath, singleImage);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('debris-images')
        .getPublicUrl(filePath);

      // Insert detection
      const { error: insertError } = await supabase
        .from('debris_detections')
        .insert({
          image_name: singleImage.name,
          image_url: urlData.publicUrl,
          x1: parseFloat(x1),
          y1: parseFloat(y1),
          x2: parseFloat(x2),
          y2: parseFloat(y2),
          confidence: parseFloat(confidence),
          debris_type: debris_type || 'Unknown',
          detection_time: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      toast.success('Detection uploaded successfully!');
      setSingleImage(null);
      setManualDetection({
        x1: '',
        y1: '',
        x2: '',
        y2: '',
        confidence: '',
        debris_type: ''
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card to-blue-950/10 border-blue-500/30">
      <CardHeader className="border-b border-blue-500/20">
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Upload className="h-5 w-5" />
          Upload Detection Data
        </CardTitle>
        <CardDescription>
          Upload CSV with images or manually add single detections
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="batch" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batch">Batch Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="sample">Sample Data</TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="csv-file" className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                CSV File (Required)
              </Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: image_name, x1, y1, x2, y2, confidence, debris_type
              </p>
            </div>

            <div>
              <Label htmlFor="image-files" className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4" />
                Image Files (Optional)
              </Label>
              <Input
                id="image-files"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(e.target.files)}
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select images matching the CSV image_name column
              </p>
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading || !csvFile}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Batch
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="single-image" className="flex items-center gap-2 mb-2">
                <Camera className="h-4 w-4" />
                Debris Image
              </Label>
              <Input
                id="single-image"
                type="file"
                accept="image/*"
                onChange={(e) => setSingleImage(e.target.files?.[0] || null)}
                disabled={uploading}
              />
              {singleImage && (
                <div className="mt-2 flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm truncate">{singleImage.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSingleImage(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="x1">X1 (Left)</Label>
                <Input
                  id="x1"
                  type="number"
                  placeholder="100"
                  value={manualDetection.x1}
                  onChange={(e) => setManualDetection({...manualDetection, x1: e.target.value})}
                  disabled={uploading}
                />
              </div>
              <div>
                <Label htmlFor="y1">Y1 (Top)</Label>
                <Input
                  id="y1"
                  type="number"
                  placeholder="100"
                  value={manualDetection.y1}
                  onChange={(e) => setManualDetection({...manualDetection, y1: e.target.value})}
                  disabled={uploading}
                />
              </div>
              <div>
                <Label htmlFor="x2">X2 (Right)</Label>
                <Input
                  id="x2"
                  type="number"
                  placeholder="300"
                  value={manualDetection.x2}
                  onChange={(e) => setManualDetection({...manualDetection, x2: e.target.value})}
                  disabled={uploading}
                />
              </div>
              <div>
                <Label htmlFor="y2">Y2 (Bottom)</Label>
                <Input
                  id="y2"
                  type="number"
                  placeholder="300"
                  value={manualDetection.y2}
                  onChange={(e) => setManualDetection({...manualDetection, y2: e.target.value})}
                  disabled={uploading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confidence">Confidence (0-1)</Label>
              <Input
                id="confidence"
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.95"
                value={manualDetection.confidence}
                onChange={(e) => setManualDetection({...manualDetection, confidence: e.target.value})}
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="debris-type">Debris Type</Label>
              <Input
                id="debris-type"
                placeholder="e.g., Satellite Fragment, Rocket Body"
                value={manualDetection.debris_type}
                onChange={(e) => setManualDetection({...manualDetection, debris_type: e.target.value})}
                disabled={uploading}
              />
            </div>

            <Button
              onClick={handleManualUpload}
              disabled={uploading || !singleImage}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Detection
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="sample" className="space-y-4 mt-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Generate Sample Data</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This will create 10 sample debris detections for testing and demonstration purposes.
              </p>
              <Button
                variant="outline"
                onClick={generateSampleData}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Sample Data
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
