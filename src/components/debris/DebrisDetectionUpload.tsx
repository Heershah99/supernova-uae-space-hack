import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
              .from('debris-detections')
              .upload(filePath, imageFile);

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from('debris-detections')
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Detection Data
        </CardTitle>
        <CardDescription>
          Upload CSV file with bounding box coordinates and optional images
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
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
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={uploading || !csvFile}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Data
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={generateSampleData}
            disabled={uploading}
          >
            Generate Sample Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
