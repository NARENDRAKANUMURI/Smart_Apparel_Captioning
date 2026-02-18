import { useState, useRef, useCallback } from 'react';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (image: { url?: string; base64?: string; preview: string }) => void;
  disabled?: boolean;
}

export const ImageUploader = ({ onImageSelect, disabled }: ImageUploaderProps) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageSelect({ base64, preview: base64 });
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageSelect({ url: urlInput.trim(), preview: urlInput.trim() });
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={mode === 'upload' ? 'default' : 'secondary'}
          onClick={() => setMode('upload')}
          disabled={disabled}
          className={cn(
            "gap-2 transition-all duration-300",
            mode === 'upload' && "bg-gradient-primary shadow-glow"
          )}
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
        <Button
          variant={mode === 'url' ? 'default' : 'secondary'}
          onClick={() => setMode('url')}
          disabled={disabled}
          className={cn(
            "gap-2 transition-all duration-300",
            mode === 'url' && "bg-gradient-primary shadow-glow"
          )}
        >
          <Link className="w-4 h-4" />
          URL
        </Button>
      </div>

      {mode === 'upload' ? (
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
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
              <ImageIcon className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                Drop your image here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse • PNG, JPG, WEBP
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Paste image URL (e.g., https://example.com/fashion.jpg)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={disabled}
              className="flex-1 bg-secondary border-border focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={disabled || !urlInput.trim()}
              className="bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity"
            >
              Analyze
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Works with any public image URL from Google, Pinterest, e-commerce sites, etc.
          </p>
        </div>
      )}
    </div>
  );
};
