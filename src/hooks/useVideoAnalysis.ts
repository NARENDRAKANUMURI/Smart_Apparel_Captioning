import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FrameAnalysis {
  frameNumber: number;
  timestamp: number;
  preview: string;
  caption?: string;
  items?: Array<{
    type: string;
    color: string;
    pattern: string;
    style: string;
  }>;
  isValid: boolean;
  reason?: string;
}

export const useVideoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [frames, setFrames] = useState<FrameAnalysis[]>([]);
  const [totalFrames, setTotalFrames] = useState(0);

  const extractFrames = useCallback(async (videoFile: File, fps: number = 1): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const frameImages: string[] = [];
      let currentTime = 0;

      video.onloadedmetadata = () => {
        canvas.width = Math.min(video.videoWidth, 512);
        canvas.height = Math.min(video.videoHeight, 512);
        
        const duration = video.duration;
        const frameInterval = 1 / fps;
        const totalExpectedFrames = Math.floor(duration * fps);
        setTotalFrames(Math.min(totalExpectedFrames, 15)); // Cap at 15 frames
        
        video.currentTime = 0;
      };

      video.onseeked = () => {
        if (ctx && frameImages.length < 15) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL('image/jpeg', 0.8);
          frameImages.push(frameData);
          
          currentTime += 1 / fps;
          if (currentTime < video.duration && frameImages.length < 15) {
            video.currentTime = currentTime;
          } else {
            resolve(frameImages);
          }
        }
      };

      video.onerror = () => reject(new Error('Failed to load video'));

      video.src = URL.createObjectURL(videoFile);
    });
  }, []);

  const analyzeFrame = async (frameBase64: string): Promise<Partial<FrameAnalysis>> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-apparel', {
        body: { imageBase64: frameBase64 },
      });

      if (error) throw new Error(error.message);
      
      if (data.error) {
        return { isValid: false, reason: data.error };
      }

      return {
        caption: data.caption,
        items: data.items,
        isValid: data.isValid,
        reason: data.reason,
      };
    } catch (err) {
      console.error('Frame analysis error:', err);
      return { isValid: false, reason: 'Analysis failed' };
    }
  };

  const analyzeVideo = async (videoFile: File) => {
    setIsAnalyzing(true);
    setProgress(0);
    setFrames([]);

    try {
      toast.info('Extracting frames from video...');
      const frameImages = await extractFrames(videoFile, 1);
      
      if (frameImages.length === 0) {
        toast.error('No frames could be extracted from the video');
        return;
      }

      toast.info(`Analyzing ${frameImages.length} frames...`);
      const analyzedFrames: FrameAnalysis[] = [];

      for (let i = 0; i < frameImages.length; i++) {
        const result = await analyzeFrame(frameImages[i]);
        
        const frameData: FrameAnalysis = {
          frameNumber: i + 1,
          timestamp: i,
          preview: frameImages[i],
          ...result,
          isValid: result.isValid ?? false,
        };
        
        analyzedFrames.push(frameData);
        setFrames([...analyzedFrames]);
        setProgress(((i + 1) / frameImages.length) * 100);
      }

      toast.success(`Analyzed ${frameImages.length} frames successfully!`);
    } catch (err) {
      console.error('Video analysis error:', err);
      toast.error('Failed to analyze video. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setFrames([]);
    setProgress(0);
    setTotalFrames(0);
  };

  return {
    isAnalyzing,
    progress,
    frames,
    totalFrames,
    analyzeVideo,
    reset,
  };
};
