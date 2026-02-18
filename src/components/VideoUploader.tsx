import { useRef, useState, useCallback } from 'react';
import { Video, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
  disabled?: boolean;
}

export const VideoUploader = ({ onVideoSelect, disabled }: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      return;
    }
    onVideoSelect(file);
  }, [onVideoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer",
        "hover:border-primary/60 hover:bg-primary/5",
        isDragging && "border-primary bg-primary/10 scale-[1.02]",
        disabled && "opacity-50 pointer-events-none",
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
        accept="video/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
          <Video className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <p className="text-lg font-display font-semibold text-foreground">
            Drop your video here
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse • MP4, MOV, WEBM
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Extracts 1 frame per second (max 15 frames)
          </p>
        </div>
      </div>
    </div>
  );
};
