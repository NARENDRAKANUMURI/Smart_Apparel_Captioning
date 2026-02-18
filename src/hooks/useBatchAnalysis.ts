import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult } from './useApparelAnalysis';
import { toast } from 'sonner';

interface ImageItem {
  id: string;
  url?: string;
  base64?: string;
  preview: string;
}

interface ImageAnalysis {
  id: string;
  preview: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  result?: AnalysisResult;
  error?: string;
}

export const useBatchAnalysis = () => {
  const [analyses, setAnalyses] = useState<ImageAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImages = useCallback(async (images: ImageItem[]) => {
    setIsAnalyzing(true);
    
    // Initialize all analyses as pending
    const initialAnalyses: ImageAnalysis[] = images.map(img => ({
      id: img.id,
      preview: img.preview,
      status: 'pending',
    }));
    setAnalyses(initialAnalyses);

    // Process images concurrently (max 3 at a time)
    const concurrencyLimit = 3;
    const queue = [...images];
    const processing: Promise<void>[] = [];

    const processImage = async (image: ImageItem) => {
      // Update status to analyzing
      setAnalyses(prev => prev.map(a => 
        a.id === image.id ? { ...a, status: 'analyzing' as const } : a
      ));

      try {
        const { data, error } = await supabase.functions.invoke('analyze-apparel', {
          body: {
            imageUrl: image.url,
            imageBase64: image.base64,
          },
        });

        if (error) throw new Error(error.message);

        if (data.error) {
          throw new Error(data.error);
        }

        // Update with result
        setAnalyses(prev => prev.map(a => 
          a.id === image.id ? { ...a, status: 'complete' as const, result: data } : a
        ));

        // Save to history if valid
        if (data.isValid) {
          await saveToHistory(image, data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
        setAnalyses(prev => prev.map(a => 
          a.id === image.id ? { ...a, status: 'error' as const, error: errorMessage } : a
        ));
      }
    };

    const worker = async () => {
      while (queue.length > 0) {
        const image = queue.shift();
        if (image) {
          await processImage(image);
        }
      }
    };

    // Start workers
    for (let i = 0; i < Math.min(concurrencyLimit, images.length); i++) {
      processing.push(worker());
    }

    await Promise.all(processing);
    setIsAnalyzing(false);
    toast.success(`Analyzed ${images.length} image${images.length > 1 ? 's' : ''}`);
  }, []);

  const saveToHistory = async (image: ImageItem, result: AnalysisResult) => {
    try {
      // For URL images, save directly
      // For base64 images, upload to storage first
      let imageUrl = image.url;
      let filePath = image.url || `url-image-${image.id}`;

      if (image.base64) {
        const fileName = `caption-${Date.now()}-${image.id}.jpg`;
        const base64Data = image.base64.split(',')[1];
        const byteArray = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fashion-uploads')
          .upload(fileName, byteArray, { contentType: 'image/jpeg' });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('fashion-uploads')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
        filePath = uploadData.path;
      }

      await supabase.from('upload_history').insert({
        file_name: `caption-${image.id}`,
        file_path: filePath,
        image_url: imageUrl || '',
        caption: result.caption || null,
        is_valid: result.isValid,
        analysis_result: result as any,
      });
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  };

  const reset = useCallback(() => {
    setAnalyses([]);
    setIsAnalyzing(false);
  }, []);

  return {
    analyses,
    isAnalyzing,
    analyzeImages,
    reset,
  };
};
