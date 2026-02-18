import { useState, useRef } from 'react';
import { Upload, ImagePlus, X, Eye, Loader2, Sparkles, CheckCircle, AlertCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { UploadHistory } from './UploadHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisResult {
  isValid: boolean;
  reason?: string;
  caption?: string;
  items?: Array<{
    type: string;
    color: string;
    pattern: string;
    style: string;
    material?: string;
    details?: string;
  }>;
  occasion?: string;
  fashionTips?: string;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  status: 'pending' | 'analyzing' | 'success' | 'error';
  result?: AnalysisResult;
  error?: string;
}

export const ImageUploadSection = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [historyKey, setHistoryKey] = useState(0);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const saveToHistory = async (image: UploadedImage, result: AnalysisResult) => {
    try {
      // Upload image to storage
      const fileExt = image.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fashion-uploads')
        .upload(filePath, image.file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fashion-uploads')
        .getPublicUrl(filePath);

      // Save to history table
      const { error: dbError } = await supabase
        .from('upload_history')
        .insert([{
          file_name: image.name,
          file_path: filePath,
          image_url: publicUrl,
          analysis_result: JSON.parse(JSON.stringify(result)),
          is_valid: result.isValid,
          caption: result.caption || null,
        }]);

      if (dbError) {
        console.error('Database insert error:', dbError);
      }
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  };

  const analyzeImage = async (image: UploadedImage): Promise<AnalysisResult | null> => {
    try {
      const base64 = await fileToBase64(image.file);
      
      const { data, error } = await supabase.functions.invoke('analyze-apparel', {
        body: {
          imageBase64: base64,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data as AnalysisResult;
    } catch (err) {
      console.error('Analysis error for', image.name, ':', err);
      throw err;
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please upload image files only');
      return;
    }

    const newImages: UploadedImage[] = imageFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      status: 'pending' as const,
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    toast.success(`Added ${imageFiles.length} image(s) for analysis`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const analyzeAllImages = async () => {
    const pendingImages = uploadedImages.filter(img => img.status === 'pending' || img.status === 'error');
    
    if (pendingImages.length === 0) {
      toast.info('No images to analyze');
      return;
    }

    setIsAnalyzingAll(true);

    // Set all pending images to analyzing state
    setUploadedImages(prev => 
      prev.map(img => 
        pendingImages.find(p => p.id === img.id) 
          ? { ...img, status: 'analyzing' as const, error: undefined }
          : img
      )
    );

    // Analyze all images concurrently
    const analysisPromises = pendingImages.map(async (image) => {
      try {
        const result = await analyzeImage(image);
        return { id: image.id, result, error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
        return { id: image.id, result: null, error: errorMessage };
      }
    });

    const results = await Promise.all(analysisPromises);

    // Update all images with their results
    setUploadedImages(prev => 
      prev.map(img => {
        const analysisResult = results.find(r => r.id === img.id);
        if (analysisResult) {
          if (analysisResult.result) {
            return { ...img, status: 'success' as const, result: analysisResult.result };
          } else {
            return { ...img, status: 'error' as const, error: analysisResult.error || 'Unknown error' };
          }
        }
        return img;
      })
    );

    // Save successful results to history
    for (const res of results) {
      if (res.result) {
        const image = pendingImages.find(img => img.id === res.id);
        if (image) {
          await saveToHistory(image, res.result);
        }
      }
    }
    
    // Refresh history
    setHistoryKey(prev => prev + 1);

    const successCount = results.filter(r => r.result).length;
    const errorCount = results.filter(r => r.error).length;

    if (successCount > 0 && errorCount === 0) {
      toast.success(`Successfully analyzed ${successCount} image(s)`);
    } else if (successCount > 0 && errorCount > 0) {
      toast.warning(`Analyzed ${successCount} image(s), ${errorCount} failed`);
    } else {
      toast.error('Failed to analyze images');
    }

    setIsAnalyzingAll(false);
  };

  const getStatusIcon = (status: UploadedImage['status']) => {
    switch (status) {
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const pendingCount = uploadedImages.filter(img => img.status === 'pending' || img.status === 'error').length;
  const analyzingCount = uploadedImages.filter(img => img.status === 'analyzing').length;

  return (
    <Tabs defaultValue="upload" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
        <TabsTrigger value="history" className="gap-2">
          <History className="w-4 h-4" />
          History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Upload Your Images</h3>
          <p className="text-sm text-muted-foreground">
            Upload fashion images to analyze with AI - multiple images processed concurrently
          </p>
        </div>
        <div className="flex gap-2">
          {uploadedImages.length > 0 && (
            <>
              <Button
                className="gap-2 bg-gradient-primary"
                onClick={analyzeAllImages}
                disabled={isAnalyzingAll || pendingCount === 0}
              >
                {isAnalyzingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing {analyzingCount}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze All ({pendingCount})
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
                  setUploadedImages([]);
                  setSelectedImage(null);
                  toast.success('All images cleared');
                }}
              >
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer",
          "hover:border-primary/60 hover:bg-primary/5",
          isDragging && "border-primary bg-primary/10 scale-[1.01]",
          "border-border"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <ImagePlus className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports PNG, JPG, WEBP • Multiple files for concurrent analysis
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Images Grid with Captions */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadedImages.map((image) => (
            <div
              key={image.id}
              className={cn(
                "group relative rounded-xl overflow-hidden bg-card border transition-all",
                image.status === 'success' && "border-green-500/50",
                image.status === 'error' && "border-destructive/50",
                image.status === 'analyzing' && "border-primary/50",
                image.status === 'pending' && "border-border/50 hover:border-primary/30"
              )}
            >
              {/* Image Section */}
              <div 
                className="aspect-[4/3] relative cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.preview}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Overlay */}
                {image.status === 'analyzing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {getStatusIcon(image.status)}
                </div>

                {/* Remove Button */}
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 left-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* View Button */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-2 right-2 h-7 opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                  onClick={() => setSelectedImage(image)}
                >
                  <Eye className="w-3 h-3" />
                  View
                </Button>
              </div>

              {/* Caption Section */}
              <div className="p-4 space-y-2">
                <p className="text-sm font-medium truncate text-foreground">{image.name}</p>
                
                {image.status === 'pending' && (
                  <p className="text-xs text-muted-foreground italic">Pending analysis...</p>
                )}
                
                {image.status === 'analyzing' && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Generating caption...
                  </p>
                )}
                
                {image.status === 'error' && (
                  <p className="text-xs text-destructive">{image.error || 'Analysis failed'}</p>
                )}
                
                {image.status === 'success' && image.result && (
                  <>
                    {!image.result.isValid ? (
                      <p className="text-xs text-destructive">{image.result.reason}</p>
                    ) : (
                      <>
                        {/* Caption Display */}
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                          <p className="text-sm text-foreground line-clamp-3">
                            {image.result.caption || 'No caption generated'}
                          </p>
                        </div>
                        
                        {/* Quick Tags */}
                        {image.result.items && image.result.items.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {image.result.items.slice(0, 3).map((item, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                            ))}
                            {image.result.items.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{image.result.items.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Occasion */}
                        {image.result.occasion && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Occasion:</span> {image.result.occasion}
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Detail Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedImage?.name}
              {selectedImage && getStatusIcon(selectedImage.status)}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              {/* Image */}
              <div>
                <img
                  src={selectedImage.preview}
                  alt={selectedImage.name}
                  className="w-full h-auto max-h-[50vh] object-contain rounded-lg"
                />
              </div>

              {/* Analysis Results */}
              <div className="space-y-4">
                {selectedImage.status === 'pending' && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Click "Analyze All" to process this image</p>
                  </div>
                )}

                {selectedImage.status === 'analyzing' && (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing image...</p>
                  </div>
                )}

                {selectedImage.status === 'error' && (
                  <div className="text-center py-8 text-destructive">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                    <p>{selectedImage.error || 'Analysis failed'}</p>
                  </div>
                )}

                {selectedImage.status === 'success' && selectedImage.result && (
                  <>
                    {!selectedImage.result.isValid ? (
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                        <p className="text-destructive">{selectedImage.result.reason}</p>
                      </div>
                    ) : (
                      <>
                        {/* Caption */}
                        {selectedImage.result.caption && (
                          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                            <p className="font-medium">{selectedImage.result.caption}</p>
                          </div>
                        )}

                        {/* Items */}
                        {selectedImage.result.items && selectedImage.result.items.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                              Detected Items
                            </h4>
                            {selectedImage.result.items.map((item, index) => (
                              <div key={index} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                                <div className="flex flex-wrap gap-1.5">
                                  <Badge className="bg-gradient-primary">{item.type}</Badge>
                                  <Badge variant="outline">{item.color}</Badge>
                                  <Badge variant="secondary">{item.style}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.pattern !== 'N/A' && <span>Pattern: {item.pattern}</span>}
                                  {item.material && <span className="ml-3">Material: {item.material}</span>}
                                </div>
                                {item.details && (
                                  <p className="text-sm">{item.details}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Occasion & Tips */}
                        {(selectedImage.result.occasion || selectedImage.result.fashionTips) && (
                          <div className="space-y-2 pt-2 border-t border-border">
                            {selectedImage.result.occasion && (
                              <p className="text-sm">
                                <span className="font-medium">Occasion:</span> {selectedImage.result.occasion}
                              </p>
                            )}
                            {selectedImage.result.fashionTips && (
                              <p className="text-sm">
                                <span className="font-medium">Fashion Tips:</span> {selectedImage.result.fashionTips}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </TabsContent>

      <TabsContent value="history">
        <UploadHistory key={historyKey} />
      </TabsContent>
    </Tabs>
  );
};
