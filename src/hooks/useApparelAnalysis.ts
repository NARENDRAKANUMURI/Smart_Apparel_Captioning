import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ApparelItem {
  type: string;
  color: string;
  pattern: string;
  style: string;
  material?: string;
  details?: string;
}

export interface AnalysisResult {
  isValid: boolean;
  reason?: string;
  caption?: string;
  items?: ApparelItem[];
  occasion?: string;
  fashionTips?: string;
}

export const useApparelAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeImage = async (imageSource: { url?: string; base64?: string }) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-apparel', {
        body: {
          imageUrl: imageSource.url,
          imageBase64: imageSource.base64,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('Too many requests. Please wait a moment and try again.');
        } else if (data.error.includes('credits')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        } else {
          toast.error(data.error);
        }
        return null;
      }

      setResult(data);
      return data;
    } catch (err) {
      console.error('Analysis error:', err);
      toast.error('Failed to analyze image. Please try again.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return {
    isAnalyzing,
    result,
    analyzeImage,
    reset,
  };
};
