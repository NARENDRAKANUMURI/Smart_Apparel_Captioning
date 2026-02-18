import { useState, useRef, useCallback } from 'react';
import { Upload, Link, X, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ImageItem {
  id: string;
  url?: string;
  base64?: string;
  preview: string;
}

interface MultiImageUploaderProps {
  onImagesSelect: (images: ImageItem[]) => void;
  disabled?: boolean;
}

export const MultiImageUploader = ({ onImagesSelect, disabled }: MultiImageUploaderProps) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleFilesSelect = useCallback((files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newImage: ImageItem = {
          id: generateId(),
          base64,
          preview: base64,
        };
        setSelectedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  }, [handleFilesSelect]);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const newImage: ImageItem = {
        id: generateId(),
        url: urlInput.trim(),
        preview: urlInput.trim(),
      };
      setSelectedImages(prev => [...prev, newImage]);
      setUrlInput('');
    }
  };

  const removeImage = (id: string) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleAnalyze = () => {
    if (selectedImages.length > 0) {
      onImagesSelect(selectedImages);
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
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer",
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
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFilesSelect(e.target.files)}
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
              <ImageIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">
                Drop images here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse • Select multiple images
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Paste image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={disabled}
              className="flex-1 bg-secondary border-border focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={disabled || !urlInput.trim()}
              variant="secondary"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Add multiple URLs one by one
          </p>
        </div>
      )}

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImages([])}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {selectedImages.map((img) => (
              <div key={img.id} className="relative group aspect-square">
                <img
                  src={img.preview}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg border border-border"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={disabled}
            className="w-full bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity"
          >
            Analyze {selectedImages.length} Image{selectedImages.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
};
