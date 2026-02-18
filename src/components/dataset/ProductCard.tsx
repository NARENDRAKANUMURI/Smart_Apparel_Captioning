import { useState } from 'react';
import { Download, Eye, Loader2, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { FashionProduct } from '@/data/fashionDataset';
import { toast } from 'sonner';

interface ProductCardProps {
  product: FashionProduct;
  onView: (product: FashionProduct) => void;
}

export const ProductCard = ({ product, onView }: ProductCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const filename = `${product.id}_${product.articleType.replace(/\s+/g, '_')}.jpg`;
    
    try {
      // Fetch the local image asset directly
      const response = await fetch(product.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${product.productDisplayName}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      {/* Image */}
      <div className="relative bg-secondary/30">
        <AspectRatio ratio={3 / 4}>
          {!imageError ? (
            <img
              src={product.imageUrl}
              alt={product.productDisplayName}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/50">
              <ImageOff className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
        </AspectRatio>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1"
            onClick={() => onView(product)}
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button
            size="sm"
            className="gap-1 bg-gradient-primary"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.productDisplayName}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs">
            {product.gender}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {product.articleType}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>{product.baseColour}</span>
          <span>{product.season} {product.year}</span>
        </div>
      </div>
    </div>
  );
};
